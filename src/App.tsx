import React, { Component, MouseEvent , useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import Button from '@material-ui/core/Button';
import HelpIcon from '@material-ui/icons/Help';
import {makeStyles, ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import { orange, green } from '@material-ui/core/colors';
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';
import { Card, CardMedia, Grid, Paper } from '@material-ui/core';
import CssBaseline from "@material-ui/core/CssBaseline";
firebase.initializeApp({
    apiKey: "AIzaSyD1bXYZ7_zi8u6TioGcWGS-8a0qYGRYieE",
    authDomain: "reactappdemo2.firebaseapp.com",
    projectId: "reactappdemo2",
    storageBucket: "reactappdemo2.appspot.com",
    messagingSenderId: "379964218330",
    appId: "1:379964218330:web:0081c40209caf9c4f8bee3"

});

const useStyles = makeStyles({
  grid:{
    justifyContent:'center',
    margin: '2%',
  },
  cardm:{
    padding:'0.01%',
    margin:'0.01%',
    border:0,
    borderRadius: 15,
    width:'auto',
  },
  media: {
    height: 0,
    paddingTop: '100%', // 16:9
    margin:'1%',
    border:0,
    borderRadius: 15,
  },
})
const theme = createMuiTheme({
  typography: {
    h2: {
      margin: '30px',
    },
    h4: {
      margin: '10px',
    }
  },
  palette:{
    background:{
      default:'#282c34',
    },
    primary:{
      main:orange[500],
    },
    secondary:{
      main:green[500],
    }
  }
})

function App() {
  console.warn = () => {};
  const classes = useStyles();
  const [Images, setImages] = useState([] as any);
  const [Imgdb, setImageDB] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const ref = firebase.firestore().collection("Images").limit(1);
  const imgref = firebase.firestore().collection("ImgLocation");
  const [URL1, setURL1] = useState("blank");
  const [URL2, setURL2] = useState("blank");
  const [URL3, setURL3] = useState("blank");
  const [URL4, setURL4] = useState("blank");
  const [answer, setAnswer] = useState("Not Available");
  const [reveal, setReveal] = useState(false);


  function getImages(){
    setLoading(true);
    ref.get().then((item) => {
      const items = item.docs.map((doc) => doc.data());
      setImages(items);
      items.map((item)=>{
        setAnswer(item.PicAnswer)
      });
    })
  }
  function getImgdb(){
    setLoading(true);
    imgref.get().then((item) => {
      const items = item.docs.map((doc) => doc.data());
      setImageDB(items);
    });
    setLoading(false);
  }
  useEffect(()=> {
    getImages();
    getImgdb();
  }, []);
  let ref1:any;
  const sbucket = firebase.storage();
  Images.map((image)=>(
    (image.PicOneID !== undefined)?
      (ref1 = sbucket.refFromURL('gs://reactappdemo2.appspot.com/images/bonus_'+image.PicOneID+'.jpg').getDownloadURL().then((url) => {
      setURL1(url);
    })):(setURL1("blank")),
    (image.PicTwoID !== undefined)?
      (ref1 = sbucket.refFromURL('gs://reactappdemo2.appspot.com/images/bonus_'+image.PicTwoID+'.jpg').getDownloadURL().then((url) => {
      setURL2(url);
    })):(setURL2("blank")),
    (image.PicThreeID !== undefined)?
      (ref1 = sbucket.refFromURL('gs://reactappdemo2.appspot.com/images/bonus_'+image.PicThreeID+'.jpg').getDownloadURL().then((url) => {
      setURL3(url);
    })):(setURL3("blank")),
    (image.PicFourID !== undefined)?
      (ref1 = sbucket.refFromURL('gs://reactappdemo2.appspot.com/images/bonus_'+image.PicFourID+'.jpg').getDownloadURL().then((url) => {
      setURL4(url);
    })):(setURL4("blank"))
  ));

  function ansToggle(){
    (reveal) ? setReveal(false) : setReveal(true);
  }

  if (loading){
    return <h1>Loading...</h1>
  } else{
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <header className="App-header">
          <Typography variant="h2">
            Guess the word?
          </Typography>
            <Grid container spacing={2} className={classes.grid}>
              {Images.map((image) => (
                  <Grid item xs={2} key={image.id + "_1"}>
                    <Card elevation={3} className={classes.cardm}>
                        <CardMedia
                          className={classes.media}
                          image={URL1}
                        />
                    </Card>
                  </Grid>
              ))}
              {Images.map((image) => (
                  <Grid item xs={2} key={image.id + "_2"}>
                    <Card elevation={3} className={classes.cardm}>
                        <CardMedia
                        className={classes.media}
                        image={URL2}
                        />
                    </Card>
                  </Grid>
              ))}
              {Images.map((image) => (
                  <Grid item xs={2} key={image.id + "_3"}>
                    <Card elevation={3} className={classes.cardm}>
                      <CardMedia
                        className={classes.media}
                        image={URL3}
                        />
                    </Card>
                  </Grid>
              ))}
              {Images.map((image) => (
                  <Grid item xs={2} key={image.id + "_4"}>
                    <Card elevation={3} className={classes.cardm}>
                      <CardMedia
                        className={classes.media}
                        image={URL4}
                        />
                    </Card>
                  </Grid>
              ))}
            </Grid>
            <Typography variant='h4' className='ansclass' style={reveal ? {} : { display: 'none' }}>
                {answer}
            </Typography>
            <Button
              onClick={() => { ansToggle() }}
              size="large"
              variant="contained"
              color="secondary"
              startIcon={<HelpIcon />}>
              Reveal Answer
            </Button>
          </header>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
