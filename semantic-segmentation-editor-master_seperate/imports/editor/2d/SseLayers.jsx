import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {ContentDuplicate, Eye, EyeOff, ArrowLeftThick, ArrowRightThick} from 'mdi-material-ui';
import SseMsg from "../../common/SseMsg";

export default class SseLayers extends React.Component {

    constructor() {
        super();
        SseMsg.register(this);
        this.state = {};

        this.state.layers = [
            // {label: "Foreground", index: 2, visible: true},
            {label: "Middle ground", index: 1,},
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
        console.log("prev clicked"); 
    }

    changeImgNxt = () => {
        this.props.history.push(image.editUrl);
        console.log("nxt clicked"); 
    }

    

    render() {

        // const path =window.location.pathname;
        // console.log(path);

        // const NxtPath =path.replace()
        


        // console.log(this.state); 

        return (
            <div>
                {/* <h1>Layers</h1> */}

                <div className="hflex" style={{margin:"15px 0px"}} >

                <div onClick={this.changeImgPrev}
                 className="sse-button grow" style={{textAlign:"center",background:"none"}} > <ArrowLeftThick/>  </div>
                <div onClick={this.changeImgNxt}
                 className="sse-button grow" style={{textAlign:"center",background:"none"}} > <ArrowRightThick/>  </div>

                </div>

                {this.state.layers.map((obj) => (
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
                ))}

            </div>
        );
    }
}
