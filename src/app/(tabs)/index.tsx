import LessonPage from '@/components/lesson components/lessonPage';
import json from '@/constants/temp.json';
import { Component } from 'react';

const temp = JSON.parse(JSON.stringify(json));

export default class Home extends Component {
  render() {
    return (
        <LessonPage
          temp={temp}
          onComplete={()=> {alert('something')}}
          handleUnlock={()=>{}}
        />
    )
  }
}
