import LessonPage from '@/components/lesson components/lessonPage';
import json from '@/constants/temp.json';
import { Component } from 'react';
import { Modal } from 'react-native';


const temp = JSON.parse(JSON.stringify(json));


export default class Home extends Component {
  render() {
    return (
      <Modal
        onRequestClose={()=>alert('something')}
      >
        <LessonPage
          temp={temp}
          onComplete={()=> {alert('something')}}
          handleUnlock={()=>{}}
        />
      </Modal>
    )
  }
}
