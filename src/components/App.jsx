import React, { Component } from 'react';
import {searchImgFromApi} from 'Api/Api';
import Searchbar from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import Loader from './Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    pictures: [],
    searchQ: '',
    page: 1,
    modalImg: false,
    loader: false,
    hideBtn: true,
    total: 0,
  };

  componentDidUpdate(_, prevState) {
    const { searchQ, page } = this.state;

    if (prevState.page !== page || prevState.searchQ !== searchQ) {
      return this.loadSearchingImg();
    }
  }

  searchImg = searchQuerry => {
    if (!searchQuerry || searchQuerry === this.state.searchQ) return;
    this.setState({ searchQ: searchQuerry, page: 1, pictures: [] });
  };

  loadSearchingImg = async () => {
    try {
      this.setState({ loader: true, hideBtn: true });
      const { searchQ, page } = this.state;
      const data = await searchImgFromApi(searchQ, page);

      if (!data.hits.length) {
        this.setState({ loader: false });
        return toast(' Sorry, we not found images...', {
          position: 'top-right',
          theme: 'light',
        });
      }

      this.setState(prevState => ({
        pictures: [...prevState.pictures, ...data.hits],
        loader: false,
        total: data.totalHits,
      }));

      if (this.state.page === Math.ceil(this.state.total / 12)) {
        toast('🦄 Sorry, this is the end of list...');
        this.setState({ hideBtn: false });
        console.log()
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  onClickLoadMore = () => {
    this.setState({ page: this.state.page + 1 });
  };

  onModalOpen = url => {
    this.setState({ modalImg: url });
  };

  onModalClose = () => {
    this.setState({
      modalImg: '',
    });
  };

  render() {
    return (
      <div className="App">
        <Searchbar onSubmit={this.searchImg} />
        <ImageGallery
          pictures={this.state.pictures}
          onClick={this.onModalOpen}
        />
        {this.state.pictures.length < this.state.total && (
          <Button onClick={this.onClickLoadMore} />
        )}

        {this.state.modalImg && (
          <Modal closeModal={this.onModalOpen} url={this.state.modalImg} />
        )}

        {this.state.loader && <Loader />}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    );
  }
}

export default App;
