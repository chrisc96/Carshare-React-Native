import React, { Component } from 'react';
import { View, Picker, ScrollView, Text, ActivityIndicator, AsyncStorage } from 'react-native';
import { FormLabel, FormInput, CheckBox, Card, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { errorTxtStyles, lightGreenButton } from '../../config/commonStyles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import styles from './post-a-ride-styles';
import * as firestoreCars from '../../data/firestore-cars';
import * as firestoreListings from '../../data/firestore-listings';

export default class PostARide extends Component {
  constructor() {
    super();

    var currentDateString = this.getCurrentDate();
    var currentTimeString = this.getCurrentTime();

    this.state = {
      storageAvail: false,
      noSeats: 0,
      meetingPoint: '',
      destination: '',
      departureDate: currentDateString,
      departureTime: currentTimeString,
      cars: [],
      selectedCarID: '',
      postBtnPressed: false,
      reqBeingSent: false
    }
  }

  componentDidMount() {
    firestoreCars.getCars(this.props.screenProps.user.uid, (cars) => {
      this.setState({ cars: cars })
    });
  }

  getCurrentDate() {
    var currentDateTime = new Date();
    var day = currentDateTime.getDate();
    var month = currentDateTime.getMonth() + 1;
    var year = currentDateTime.getFullYear();

    return year + '-' + month + '-' + day;
  }

  getCurrentTime() {
    var currentDateTime = new Date();
    var minutes = currentDateTime.getMinutes();
    var hours = currentDateTime.getHours();

    return hours + ':' + minutes;
  }

  addListing() {
    this.setState({ postBtnPressed: true });

    if (this.formValid()) {
      this.setState({ reqBeingSent: true });

      firestoreListings.addListing(this.props.screenProps.user.uid, this.state.selectedCarID, this.state.meetingPoint, this.state.destination, this.state.departureDate, this.state.departureTime, this.state.noSeats, this.state.storageAvail, (success) => {
        if (success) {
          this.clearFields();
        } else {
          this.setState({ signupBtnPressed: false })
          this.setState({ reqBeingSent: false })
        }
      })
    }
  }

  clearFields() {
    this.setState({
      storageAvail: false,
      noSeats: 0,
      meetingPoint: '',
      destination: '',
      departureDate: '2018-10-05',
      departureTime: '07:28',
      selectedCarID: '',
      postBtnPressed: false,
      reqBeingSent: false
    })
  }

  convertToNum(text) {
    var text = text.replace(/\D/g, '');
    var number = parseInt(text, 10)
    this.setState({ noSeats: number })
  }

  onChange(carID) {
    if (carID === 'Add new car') {
      this.goToAddACar();
    } else {
      this.setState({ selectedCarID: carID })
    }
  }

  goToAddACar = () => {
    this.props.navigation.navigate('AddACar')
  }

  formValid() {
    return this.state.selectedCarID &&
      this.state.meetingPoint.length > 0 &&
      this.state.destination.length > 0
  }

  render() {
    var carItems = this.state.cars.map((car, index) => {
      return <Picker.Item key={index + 1} value={car.key} label={car.make + ' ' + car.model} />
    });

    return (
      <ScrollView>
        <View style={styles.form}>
          <Card
            containerStyle={styles.postARideCard}
            titleStyle={styles.postARideCardTitle}
            dividerStyle={styles.divider}
            title='Post a ride'
          >
            <FormLabel>CAR TO USE</FormLabel>
            <Picker
              selectedValue={this.state.selectedCarID}
              style={styles.indented}
              onValueChange={(carID) => this.onChange(carID)}>
              <Picker.Item key={0} value='' label='Please select car...' />
              {carItems}
              <Picker.Item key={carItems.length + 1} value='Add new car' label='Add new car' />
            </Picker>
            <Text style={[styles.indented, errorTxtStyles]}>
              {!this.state.selectedCarID && this.state.postBtnPressed ? "Please select a car" : ""}
            </Text>

            <FormLabel>SPACE FOR BAGS?</FormLabel>
            <CheckBox
              checked={this.state.storageAvail}
              onPress={() => this.setState({ storageAvail: !this.state.storageAvail })}
            />

            <FormLabel>No. SEATS AVAILABLE</FormLabel>
            <FormInput
              value={'' + this.state.noSeats}
              onChangeText={text => this.convertToNum(text)} keyboardType='numeric'
            />

            <FormLabel>MEETING PLACE</FormLabel>
            {this.meetingPlaceAutoComplete()}
            <Text style={[styles.indented, errorTxtStyles]}>
              {this.state.meetingPoint.length === 0 && this.state.postBtnPressed ? "Please enter a meeting point" : ""}
            </Text>

            <FormLabel>DESTINATION</FormLabel>
            {this.destinationAutoComplete()}
            <Text style={[styles.indented, errorTxtStyles]}>
              {this.state.destination.length === 0 && this.state.postBtnPressed ? "Please enter a destination" : ""}
            </Text>


            <FormLabel>DEPARTURE DATE</FormLabel>
            <DatePicker
              date={this.state.departureDate}
              mode="date"
              confirmBtnText="Done"
              cancelBtnText="Cancel"
              style={[styles.indented, styles.datePicker]}
              onDateChange={(date) => { this.setState({ departureDate: date }) }}
            />

            <FormLabel>DEPARTURE TIME</FormLabel>
            <DatePicker
              date={this.state.departureTime}
              mode="time"
              confirmBtnText="Done"
              cancelBtnText="Cancel"
              style={[styles.indented, styles.datePicker]}
              onDateChange={(time) => { this.setState({ departureTime: time }) }}
            />

            {this.state.reqBeingSent ?
              <Button
                loading
                buttonStyle={lightGreenButton}
              /> :
              <Button
                title='POST'
                onPress={() => this.addListing()}
                buttonStyle={lightGreenButton}
              />
            }

          </Card>
        </View>
      </ScrollView>
    );
  }


  meetingPlaceAutoComplete = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder='Enter a meeting point'
        minLength={2}
        autoFocus={false}
        listViewDisplayed='auto'
        returnKeyType={'default'}
        fetchDetails={true}
        listViewDisplayed={false}
        onPress={(data, details = null) => {
          this.setState({ meetingPoint: data.description })
        }}
        query={{
          key: 'AIzaSyBlFRuN8KbZssVHaIcC-gnCIA4pTVrYu_w',
          language: 'en',
        }}

        styles={{
          indented: {
            margin: 10,
            paddingLeft: '3%'
          },
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0
          },
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 16
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
        }}
        currentLocation={false}
        debounce={300}
      />
    )
  }

  destinationAutoComplete = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder='Enter a destination'
        minLength={2}
        autoFocus={false}
        listViewDisplayed='auto'
        returnKeyType={'default'}
        fetchDetails={true}
        listViewDisplayed={false}
        onPress={(data, details = null) => {
          this.setState({ destination: data.description })
        }}
        query={{
          key: 'AIzaSyBlFRuN8KbZssVHaIcC-gnCIA4pTVrYu_w',
          language: 'en',
        }}

        styles={{
          indented: {
            margin: 10,
            paddingLeft: '3%'
          },
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0
          },
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 16
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
        }}
        currentLocation={false}
        debounce={300}
      />
    )
  }

}
