import React from 'react';

import { darkBaseTheme, MuiThemeProvider } from '@material-ui/core/styles';
import SseText from "../common/SseText";
import SseImageThumbnail from "./SseImageThumbnail";

import SseNavigatorToolbar from "./SseNavigatorToolbar";

import { CardText, CardTitle, IconButton, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';


import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import { Link } from 'react-router-dom'
import { ArrowLeftBold, ArrowRightBold, Folder } from 'mdi-material-ui';
import SseTheme from "../common/SseTheme";
import SseGlobals from "../common/SseGlobals";
import SseMsg from "../common/SseMsg";

import Pagination from "react-pagination-library";
import "react-pagination-library/build/css/index.css"; //for css
import { log } from 'util';



class SseNavigatorApp extends React.Component {

    anotationArray = [];
    jump;
    constructor(props) {
        super(props);
        SseMsg.register(this);
        this.increment = 50;
        this.state = {
            pageLength: this.increment,
            selection: new Set(),
            activePage: 15,
            currentPage: 0,
            search:''
        };

    }



//old search bar---------
    // handleChange = (event) => {
    //     const propsValue = this.props;
    //     const stateValue = this.state;

    //     this.jump = event.target.value;

    //     this.serverCall(propsValue, stateValue, this.jump)

    // };


    handleChangeSearch = (e) => {
            this.setState({ search: e.target.value });
            console.log(this.state.search);
    }



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

    startEditing(image) {
        // this.props.history.push(image.editUrl);
        this.props.history.push(image.editUrl,{
        state: { 
            data: "qwerty "
        }
        });
        
    }


    render() {
        const { search } = this.state;

        const propsValue = this.props;
        const stateValue = this.state;

        // console.log(this.state.data);
        

        
        if (localStorage.getItem("current") == '') {
            this.curr_page = 1;
        }
        else {
            this.curr_page = localStorage.getItem("current")
        }


        this.anotationArray = []
        if (this.state.data == undefined)
            return <div></div>

        if (this.state.data.error) {
            return <div>{this.state.data.error}</div>
        }
        
        //  search functionality for folder  
        const folders = this.state.data.folders.filter(folder => {
            return folder.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          });

        return (
            <div>



                <MuiThemeProvider theme={new SseTheme().theme}>

                    <div className="w100">
                        <SseNavigatorToolbar history={this.props.history} />
                        {/* ------old search bar---- */}
                        {/* {
                            this.state.activePage ?
                                <TextField
                                    id="outlined-search"
                                    label="Search Page"
                                    type="number"
                                    margin="normal"
                                    variant="outlined"
                                    inputProps={{ min: "1", step: "1" }}
                                    style={{ width: 150, marginLeft: 15 }}
                                    onChange={this.handleChange}
                                /> : ''
                        } */}   

                        {/* {
                            this.state.activePage ?
                                <h5 style={{ marginLeft: 15 }}>Current Page : &emsp;{this.curr_page}</h5> : ''
                        } */}
                        {
                            this.state.activePage ?
                            <div className="hflex">
                             
                             <div className="grow" >
                            <Pagination 
                            currentPage={this.state.currentPage}
                            totalPages={this.state.activePage}
                            changeCurrentPage={(params) => this.serverCall(propsValue, stateValue, params)}
                            theme="bottom-border" 
                            />
                            </div>

                            <div className="patientinfo">
                              <div className="table-row">
                                <div>Rescale</div>
                                <div>Rescale</div>
                              </div>        
                              <div className="table-row">
                                <div>Rescale</div>
                                <div>Rescale</div>
                              </div>
                            </div>

                            </div>
                            :''}


                        <div className="sse-pager hflex">
                            {/* <Link to={this.state.data.previousPage || "#"}>
                            <IconButton touch="true"
                                classes={{ "colorPrimary": "white" }}
                                className={this.state.data.previousPage ? "" : "visibility-hidden"}>
                                <ArrowLeftBold />
                            </IconButton>
                        </Link> */}
                            <SseText msgKey="folderStats" className="grow sse-folder-stats"></SseText>

                            {
                            this.state.activePage ? '':
                            <TextField
                                    id="outlined-search"
                                    label="Search"
                                    type="text"
                                    margin="normal"
                                    variant="outlined"
                                    value={search}
                                    inputProps={{ min: "1", step: "1" }}
                                    style={{ margin: '0px 50px' }}
                                    onChange={this.handleChangeSearch}
                                />
                            }

                            {/* <Link to={this.state.data.nextPage || "#"}>
                            <IconButton touch="true"
                                classes={{ "colorPrimary": "white" }}
                                className={this.state.data.nextPage ? "" : "visibility-hidden"}>
                                <ArrowRightBold />
                            </IconButton>
                        </Link> */}
                        </div>

                        <div className="hflex wrap w100 h100">
                            
                            
                            {folders.map((p) =>
                                (<Link key={p.url} to={p.url}>
                                    <div className="vflex flex-align-items-center sse-folder">
                                        <Folder />
                                        <Typography align="center" noWrap
                                            style={{ width: "200px" }}>{p.name}</Typography>
                                    </div>
                                </Link>)
                            )}

                        </div>

                        <div style={{ backgroundColor: 'black' }}>
                             
                        </div>

                        <div className="hflex wrap w100 h100">

                      {console.log(this.state.data)}
                            

                            {this.state.data.images.map((image, i) => {

                                (this.props.urlMap.get(decodeURIComponent(image.url)) != undefined ? this.anotationArray.push(i) : '')

                                return (<div
                                    onClick={() => this.startEditing(image)}
                                    onDoubleClick={() => { this.startEditing(image) }}
                                    key={SseGlobals.getFileUrl(image.url) + Math.random()}>
                                    <SseImageThumbnail image={image}
                                        annotated={this.props.urlMap.get(decodeURIComponent(image.url))}
                                        anotationArray={this.anotationArray}
                                        keys={i}
                                    />

                                </div>)
                            })}
                        </div>

                    </div>


                </MuiThemeProvider>
            </div>
        );

    }

}

export default withTracker((props) => {
    Meteor.subscribe("sse-labeled-images");
    const annotated = SseSamples.find({ file: { "$exists": true } }).fetch();
    let urlMap = new Map();
    annotated.forEach(o => urlMap.set(decodeURIComponent(o.url), true));
    return { urlMap };
})(SseNavigatorApp);
