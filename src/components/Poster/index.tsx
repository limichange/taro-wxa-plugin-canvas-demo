import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.less'

interface Poster {
  props: {}
}

class Poster extends Component {
  render() {
    return <View className='Poster'></View>
  }
}

export default Poster as ComponentType
