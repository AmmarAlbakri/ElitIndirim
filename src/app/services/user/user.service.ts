import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api: ApiService) { }

  login(username, password) {
    const data = {
      'email': username,
      'password': password
    };
    return this.api.post(`/users/login`, data);
  }

  logout() {
    return this.api.post('/users/logout', {});
  }

  signup(userData) {
    return this.api.post(`/users/signup`, userData);
  }

  getAddresses() {
    return this.api.get('/address');
  }

  addAddress(address) {
    return this.api.post('/address', address);
  }

  editAddress(addressID, address) {
    return this.api.put(`/address/${addressID}`, address);
  }

  deleteAddress(addressID) {
    return this.api.delete(`/address/${addressID}`);
  }

  getAllCountries() {
    return this.api.localGet('assets/json/countries.json');
  }

  getAllCities(countryCode) {
    // return this.api.localGet('../../../assets/json/cities.json');
    console.log('22: ', countryCode);
    return this.api.get(`/city?country=${countryCode}`);
  }

  getAllCitiesLocal() {
    return this.api.localGet('assets/json/cities.json');
  }

  getUserProfile() {
    return this.api.get(`/users/me`);
  }

  editUserProfile(data) {
    return this.api.post('/users/resetuser', data);
  }

  changeUserPassword(data) {
    return this.api.post('/users/resetPassword', data);
  }

  getInfoPages() {
    return this.api.get('/settings/');
  }

  contactUs(data) {
    return this.api.post('/contactus', data);
  }
  forgotPassword(data) {
    return this.api.post('/users/forget/', data);
  }

  facebookLogin(data) {
    return this.api.post('/users/facebookLogin', data);
  }

  googleLogin(data) {
    return this.api.post('/users/googleLogin', data);
  }
}
