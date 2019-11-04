import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {ContentDuplicate, Eye, EyeOff, ArrowLeftThick, ArrowRightThick} from 'mdi-material-ui';
import SseMsg from "../../common/SseMsg";

import {Redirect} from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import PropTypes from 'prop-types'

export default class SseLayers extends React.Component {

    constructor() {
        super();
        SseMsg.register(this);
        this.state = {};

        this.state.layers = [
            // {label: "Foreground", index: 2, visible: true},
            {label: "Compare", index: 1,},
            // {label: "Background", index: 0, visible: true}
        ];
        this.state.selected = 0;

    };

    

    componentDidMount() {
        this.onMsg("sse-image-loaded", () => {
            this.state.layers.forEach(s => s.visible = true);
            this.state.selected = 0;
            this.setState(this.state);
        });

        this.onMsg("sse-polygon-select", (arg) => {
            if (arg && arg.polygon) {
                this.setState({selected: arg.polygon.feature.layer || 0});
                this.selectedPolygon = arg.polygon;
                this.setState({polygonLayer: arg.polygon != undefined ? arg.polygon.feature.layer : undefined});
            } else {
                this.setState({polygonLayer: undefined});
            }
        });


        this.onMsg("layer-object-count", arg => {
            this.state.layers.forEach(o => o.count = 0);
            arg.map.forEach((v, k) => {
                this.state.layers[this.state.layers.length - 1 - k].count = v;
            });
            this.setState(this.state)
        })
    }

    componentWillUnmount(){
        SseMsg.unregister(this);
    }

    toggle(idx) {
        let visible = this.state.layers[this.state.layers.length - 1 - idx].visible =
            !this.state.layers[this.state.layers.length - 1 - idx].visible;
        this.setState(this.state);
        if (visible)
            this.sendMsg("layer-show", {index: idx});
        else
            this.sendMsg("layer-hide", {index: idx});
    }

    select(idx) {
        this.setState({selected: idx});
        this.sendMsg("layer-select", {index: idx});
    }

    changeLayer(idx) {
        this.sendMsg("polygon-set-layer", {polygon: this.selectedPolygon, layer: idx});
        this.setState({selected: idx, polygonLayer: idx});

    }

    changeImgPrev = () => {
        let prevhistorypath = this.state.prevpath
        console.log(prevhistorypath);

        // this.props.history.push(prevhistorypath); 
        window.location.assign(prevhistorypath);   {/* check the property */}
    }

    changeImgNxt = () => {
        let historypath = this.state.nextpath
        console.log(historypath);
        // this.props.history.push(historypath);
    }

    //  function to find the next and prev path based o current window location
    componentDidMount() {
        const path =window.location.pathname;
        const len = path.length;
        var indexs = path.lastIndexOf(".png");
        var num = indexs - 3;
        let imgpath = path.slice(num,len);

        console.log(imgpath);
        

        var indexss = imgpath.lastIndexOf(".png");

         let imgpaths = imgpath.slice(0,indexss);
         let nums = parseInt(imgpaths);
         let Imgnumber = nums + 1;
         
         let ImgnumberPrev = nums - 1;
         let imgNum = String(Imgnumber);
         let imgNumPrev = String(ImgnumberPrev);

         let check = '00'+imgNumPrev;

         console.log(check);
         

         let nwImgindx = imgNum.concat('.png');
         let nwImgindxPrev = check.concat('.png');

         var nextpath = path.replace(imgpath, nwImgindx);
         var prevpath = path.replace(imgpath, nwImgindxPrev);
         


         this.setState({
             nextpath:nextpath,
             prevpath:prevpath
         })
    }

    // -------- nxt and prev location --------

    comapre=()=>{
        console.log("compare");
    }
    

    render() {
         
         console.log(this.state);

        return (
            <div>
                {/* <h1>Layers</h1> */}

                <div className="hflex" style={{margin:"15px 0px"}} >

                <div onClick={this.changeImgPrev}
                 className="sse-button grow" style={{textAlign:"center",background:"none"}} > <ArrowLeftThick/>  </div>
                <div onClick={this.changeImgNxt}
                 className="sse-button grow" style={{textAlign:"center",background:"none"}} > <ArrowRightThick/>  </div>

                </div>
                {/* {this.state.layers.map((obj) => (
                    <div key={obj.index} className="sse-layer hflex flex-align-items-center">
                        <div className={this.state.selected == obj.index ? "selected" : ""}>
                            <div onClick={() => this.toggle(obj.index)} className="sse-layer-eye">
                                {obj.visible ? <Eye/> : <EyeOff/>}</div>
                            <div className="grow flex-align-items-center"
                                 onClick={() => this.select(obj.index)}>
                                <div className="p5 grow">{obj.label + (obj.count ? " (" + obj.count + ")" : "")}</div>
                            </div>
                            {this.state.polygonLayer != undefined && this.state.polygonLayer != obj.index ?
                                <div onClick={() => {
                                    this.changeLayer(obj.index)
                                }}>
                                    <ContentDuplicate/>
                                </div> : null}
                        </div>
                    </div>
                ))} */}

                {
                    <div>
                    {/* <Eye/> Compare */}
                    <div>

                    <div className="sse-layer hflex flex-align-items-center" onClick={this.comapre} >
                            <div  className="" style={{width:'auto'}}>
                                 <Eye/> </div>
                            <div className="grow flex-align-items-center">
                                <div className="p5 grow">Compare</div>
                            </div>
                    </div>
                    
                    </div>
                    
                    </div>
                }

            </div>
        );
    }
}
