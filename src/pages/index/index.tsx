import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import Poster from '../../components/Poster'
import './index.less'

export default class Index extends Component {
  state = {
    // posterConfig: posterConfig.jdConfig
  }

  onPosterSuccess = e => {
    const { detail } = e
    Taro.previewImage({
      current: detail,
      urls: [detail]
    })
  }

  onPosterFail = err => {
    console.error(err)
  }

  // onCreatePoster = () => {
  //   this.setState({ posterConfig: posterConfig.demoConfig }, () => {
  //     // Poster.create(true) // 入参：true为抹掉重新生成
  //   })
  // }

  // onCreateOtherPoster = () => {
  //   this.setState({ posterConfig: posterConfig.jdConfig }, () => {
  //     // Poster1.create(true) // 入参：true为抹掉重新生成
  //   })
  // }

  render() {
    // const { posterConfig } = this.state
    return (
      <View>
        {/* index.wxml */}
        {/* <Poster
          id="poster"
          hideLoading={true}
          preload={false}
          config={posterConfig}
          onSuccess={this.onPosterSuccess}
          onFail={this.onPosterFail}>
          <Button>生成海报</Button>
        </Poster> */}
        <Poster />
      </View>
    )
  }
}
