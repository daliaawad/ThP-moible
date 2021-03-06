import React, {SyntheticEvent} from 'react';
import {SafeAreaView, ScrollView, View, Text, StatusBar} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import {Input, Button, Image} from 'react-native-elements';
import HandyHeader from './HandyHeader';
import {connect, Dispatch} from 'react-redux';
import * as types from '../state/types';
import {
  changeStateItem,
  changeStateSignedIn,
  setUserName,
} from '../state/actions';
import validate from 'validate.js';

export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  changeState: any;
  changeSignedInState: any;
  setUserName: any;
}

class SignUp extends React.Component<Props, object> {
  state = {
    // personal info
    userName: '',
    userNameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    mobileNO: null,
    mobileNOError: '',
    loginError: '',
    signUpLoading: false,
  };
  //@Function: signUp
  // @Description: Save profile info to the database
  async signUp() {
    if (
      this.state.emailError === undefined &&
      this.state.passwordError === undefined &&
      this.state.userNameError === undefined &&
      this.state.mobileNOError === undefined
    ) {
      // console.log(this.state)
      const {navigation} = this.props;
      this.setState({
        signUpLoading: true,
        isSubmitted: true,
      });

      var userData = {
        userName: this.state.userName.trim(),
        email: this.state.email.trim(),
        mobileNO: this.state.mobileNO,
        password: this.state.password.trim(),
      };

      fetch('https://salty-garden-58258.herokuapp.com/auth/userSignUp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((res: any) => res.json())
        .then((resJson: any) => {
          if (resJson.token !== undefined) {
            var SharedPreferences = require('react-native-shared-preferences');
            SharedPreferences.setName('handyInfo');
            SharedPreferences.setItem('handyToken', resJson.token);
            this.props.changeSignedInState(1);
            this.props.setUserName(this.state.userName.trim());
            this.setState({
              userName: '',
              email: '',
              password: '',
              mobileNO: null,
              signUpLoading: false,
            });
            navigation.navigate(navigation.getParam('nextPage'));
          } else {
            this.setState({
              loginError: resJson.msg,
            });
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({
            signUpLoading: false,
          });
        });
    }
    return;
  }
  //@Function: render
  //@Description: render the component
  render() {
    const {navigation} = this.props;
    const {
      userName,
      userNameError,
      email,
      emailError,
      password,
      passwordError,
      mobileNO,
      mobileNOError,
      signUpLoading,
      loginError,
    } = this.state;

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
            <HandyHeader navigation={navigation} title="Sign Up" />
            <View
              style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('./../assets/Handy.png')}
                style={{flex: 2, width: 150, height: 190, marginBottom: 20}}
              />
            </View>
            <Input
              containerStyle={{
                flex: 1,
                marginTop: 15,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
              }}
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                marginTop: 5,
                color: '#666',
              }}
              onSubmitEditing={() => {
                this.secondTextInput.focus();
              }}
              blurOnSubmit={false}
              label="Name:"
              labelStyle={{fontSize: 18, color: '#666'}}
              onBlur={() => {
                this.setState({
                  userNameError: validate(
                    {userName: userName},
                    {
                      userName: {
                        presence: true,
                        type: 'string',
                        length: {minimum: 6},
                      },
                    },
                    {format: 'flat'},
                  ),
                });
              }}
              onChangeText={(userName: string) => this.setState({userName})}
              placeholder={'Enter your Name...'}
              errorMessage={
                Array.isArray(userNameError) ? userNameError[0] : userNameError
              }
              placeholderTextColor="#999">
              {userName}
            </Input>
            <Input
              ref={(input: any) => {
                this.secondTextInput = input;
              }}
              containerStyle={{
                flex: 1,
                marginTop: 15,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
              }}
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                marginTop: 5,
                color: '#666',
              }}
              onSubmitEditing={() => {
                this.thirdTextInput.focus();
              }}
              blurOnSubmit={false}
              label="Email:"
              labelStyle={{fontSize: 18, color: '#666'}}
              onChangeText={(email: string) => this.setState({email})}
              onBlur={() => {
                this.setState({
                  emailError: validate(
                    {email: email},
                    {email: {presence: true, email: true}},
                    {format: 'flat'},
                  ),
                });
              }}
              placeholder={'Enter your email ...'}
              errorMessage={
                Array.isArray(emailError) ? emailError[0] : emailError
              }
              placeholderTextColor="#999">
              {email}
            </Input>
            <Input
              ref={(input: any) => {
                this.thirdTextInput = input;
              }}
              containerStyle={{
                flex: 1,
                marginTop: 15,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
              }}
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                marginTop: 5,
                color: '#666',
              }}
              onSubmitEditing={() => {
                this.forthTextInput.focus();
              }}
              blurOnSubmit={false}
              label="Mobile No.:"
              keyboardType="number-pad"
              labelStyle={{fontSize: 18, color: '#666'}}
              onChangeText={(mobileNO: any) => this.setState({mobileNO})}
              onBlur={() => {
                this.setState({
                  mobileNOError: validate(
                    {mobileNO: mobileNO},
                    {mobileNO: {presence: true, length: {minimum: 6}}},
                    {format: 'flat'},
                  ),
                });
              }}
              placeholder={'Enter your Mobile NO...'}
              placeholderTextColor="#999"
              errorMessage={
                Array.isArray(mobileNOError) ? mobileNOError[0] : mobileNOError
              }>
              {mobileNO}
            </Input>
            <Input
              ref={(input: any) => {
                this.forthTextInput = input;
              }}
              containerStyle={{
                flex: 1,
                marginTop: 15,
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
              }}
              inputStyle={{
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
                marginTop: 5,
                color: '#666',
              }}
              label="Password:"
              secureTextEntry={true}
              labelStyle={{fontSize: 18, color: '#666'}}
              onBlur={() => {
                this.setState({
                  passwordError: validate(
                    {password: password},
                    {password: {presence: true, length: {minimum: 6}}},
                    {format: 'flat'},
                  ),
                });
              }}
              onChangeText={(password: any) => this.setState({password})}
              placeholder={'Enter your password...'}
              errorMessage={
                Array.isArray(passwordError) ? passwordError[0] : passwordError
              }
              placeholderTextColor="#999">
              {password}
            </Input>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: '#F44324',
                textAlign: 'center',
              }}>
              {' '}
              {loginError}
            </Text>

            <View style={{flex: 1, margin: 10}}>
              <Button
                buttonStyle={{
                  backgroundColor: '#078ca9',
                  flex: 1,
                  marginTop: 15,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: 280,
                }}
                titleStyle={{
                  color: '#f2f2f2',
                }}
                title="Sign up"
                onPress={() => this.signUp()}
                loading={signUpLoading}
                loadingStyle={{borderColor: '#67A443'}}></Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

//@Function: mapDispatchToProps
//@Description: send actions as components props
const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeState: (id: number, state: number) => {
    dispatch(changeStateItem(id, state));
  },
  changeSignedInState: (state: number) => {
    dispatch(changeStateSignedIn(state));
  },
  setUserName: (userName: string) => {
    dispatch(setUserName(userName));
  },
});

export default connect(null, mapDispatchToProps)(SignUp);
