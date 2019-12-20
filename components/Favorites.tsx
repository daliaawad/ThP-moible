import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import {
  Card,
  ListItem,
  Button,
  Icon,
  Rating,
  Text,
} from 'react-native-elements';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import HandyHeader from './HandyHeader';
// import {connect} from 'react-redux';
// import * as types from '../state/types';
// import {Dispatch} from 'react-redux';
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
class Favorites extends React.Component<Props, object> {
  state = {
    favorites: [],
  };
  componentDidMount() {
    var that = this;
    var SharedPreferences = require('react-native-shared-preferences');
    SharedPreferences.setName('handyInfo');
    SharedPreferences.getItem('handyToken', async function (value: any) {
      if (value === null) {
        console.log('no token');
        that.props.navigation.navigate('SignIn');
      } else {
        await fetch('https://salty-garden-58258.herokuapp.com/mobileApi/favorites', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerID: value }),
        })
          .then(res => res.json())
          .then(resJson => {
            that.setState({
              favorites: resJson.favorites,
            });
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  }

  render() {
    const { favorites } = this.state;
    const { navigation } = this.props;
    return (
      <>
        <HandyHeader navigation={navigation} title={'Favorites'} />
        {favorites.map((provider, i) => {
          console.log('prodived id in favs**********', provider)
          return (
            <Card containerStyle={{ padding: 5 }} key={i}>
              <View >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProviderProfile', {
                      userId: provider['id'],
                    })
                  }>
                  <ListItem
                    leftAvatar={{
                      title: provider['userName'][0],
                      source: { uri: provider['userImg'] },
                    }}
                    title={provider['userName']}
                    subtitle={provider['ServiceCategory']}
                    chevron></ListItem>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
      </>
    );
  }
}

export default Favorites;
