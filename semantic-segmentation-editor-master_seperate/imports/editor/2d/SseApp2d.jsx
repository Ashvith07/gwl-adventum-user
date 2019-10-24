import React from 'react';


import SseClassChooser from "../../common/SseClassChooser";

import SseEditor2d from "./SseEditor2d";
import SseSliderPanel from "./SseSliderPanel";
import {darkBaseTheme, MuiThemeProvider} from '@material-ui/core/styles';

import SseGlobals from "../../common/SseGlobals";
import {Meteor} from "meteor/meteor";
import SseSnackbar from "../../common/SsePopup";
import {withTracker} from 'meteor/react-meteor-data';
import SseBottomBar from "../../common/SseBottomBar";

import SseConfirmationDialog from "../../common/SseConfirmationDialog";
import {Autorenew} from 'mdi-material-ui';
import SseTheme from "../../common/SseTheme";
import SseToolbar2d from "./SseToolbar2d";
import SseSetOfClasses from "../../common/SseSetOfClasses";
import SseTooltips2d from "./SseTooltips2d";
import tippy from "tippy.js";





// import { withTracker } from 'meteor/react-meteor-data';
// import { Meteor } from "meteor/meteor";
// import { ArrowLeftBold, ArrowRightBold, Folder } from 'mdi-material-ui';
// import SseTheme from "../../common/SseTheme";
// import SseGlobals from "../../common/SseGlobals";
// import SseMsg from "../../common/SseMsg";



export default class SseApp2d extends React.Component {

    constructor() {
        super();

        this.state = {};

        this.state.imageReady = false;
        this.state.classesReady = false;

        this.classesSets = [];
        Meteor.call("getClassesSets", (err, res) => {
            this.classesSets = res.map(cset => new SseSetOfClasses(cset));
            this.setState({classesReady: true});
        });
    }


    // copied from SseNavigator for state

    serverCall = (props, state, numPage) => {

        if(numPage){
          localStorage.setItem("current",numPage );

      }
      this.setState(state => state.currentPage = Number(numPage));
      // console.log(this.state.currentPage, numPage, 'totqlss')



      const params = props.match.params;
      

      const fi = numPage ? (Number(numPage) - 1) : 0;
      const ti = state.pageLength || this.increment;
      // console.log("props==", props)
      // console.log("tiiii", ti)
      if (this.state.data) {
          this.state.data.nextPage = this.state.data.previousPage = null;
          this.setState(this.state);
      }
      Meteor.call("images", params.path, fi, ti, (err, res) => {
          console.log(res);
          this.setState({ data: res });
          console.log(res);

          // console.log("this.state.data", this.state.data)
          if (res) {

              // console.log("res===", res)
              const page_no = Math.ceil(res.imagesCount / this.increment)
              this.setState({ activePage: page_no })

              let msg = "";
              if (res.folders.length > 0) {
                  msg += res.folders.length + " folder";
                  if (res.folders.length > 1)
                      msg += "s";
              }
              if (res.images.length > 0) {
                  if (res.folders.length > 0)
                      msg += ", ";
                  msg += res.imagesCount + " image";
                  if (res.imagesCount > 1)
                      msg += "s";
              }
              this.sendMsg("folderStats", { message: msg });

          } else {
              // console.log(err);
          }

      });
  }

  componentWillReceiveProps(props) {
      // alert("hey");
      let value=localStorage.getItem("current")
      // alert(value);
      this.serverCall(props, this.state,value);
  }

  componentDidMount() {
      this.serverCall(this.props, this.state, '');
  }


    //    ---- till here copied from SseNavigator for state


    setupTooltips() {
        tippy('[title]', {
            theme: 'sse',
            arrow: true,
            delay: [800, 0]
        })
    }


    

    componentDidUpdate() {
        this.setupTooltips();
    }

    componentDidMount() {
        this.setupTooltips();
        const sourceImage = $("#sourceImage");
        sourceImage.on("load", () => {
                this.setState({imageReady: true});
        });
        sourceImage.attr("src", SseGlobals.getFileUrl(this.props.imageUrl));
    }

    componentWillUnmount() {
        $("#sourceImage").off();
    }

    render() {

        // console.log(this.state);
        
       
        
        const ready = this.state.imageReady && this.state.classesReady;
        return (
            <div className="w100 h100">
                <MuiThemeProvider theme={new SseTheme().theme}>
                    <div className="w100 h100 editor">
                        <div className="vflex w100 h100 box1">
                            <SseToolbar2d/>
                            <div className="hflex grow box2 relative h0">
                                {ready ? <SseClassChooser classesSets={this.classesSets}/> : null}
                                <div id="canvasContainer" className="grow relative">
                                    {ready
                                        ? <SseEditor2d
                                            imageUrl={this.props.imageUrl}/>
                                        : null}
                                    <div id="waiting"
                                         className="hflex flex-align-items-center absolute w100 h100">
                                        <div className="grow vflex flex-align-items-center">
                                            <Autorenew/>
                                        </div>
                                    </div>

                                </div>
                                <SseSliderPanel/>
                            </div>
                            <SseBottomBar/>
                        </div>
                        <SseSnackbar/>
                        <SseConfirmationDialog
                            startMessage="reset-start" endMessage="reset-end"
                            title="Segmentation Reset"
                            text="This will delete all existing polygons and tags, are you sure?"></SseConfirmationDialog>
                    </div>
                    <SseTooltips2d/>
                </MuiThemeProvider>
            </div>
        );
    }
}

