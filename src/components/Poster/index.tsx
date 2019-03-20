import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.less'

interface Poster {
  props: {}
}

class Poster extends Component {
  factor

  componentDidMount() {
    const sysInfo = window['wx'].getSystemInfoSync()
    const screenWidth = sysInfo.screenWidth
    this.factor = screenWidth / 750
  }

  render() {
    return <View className='Poster' />
  }
}

export default Poster as ComponentType
