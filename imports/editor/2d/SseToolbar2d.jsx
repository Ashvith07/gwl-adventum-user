import React from 'react';
import SseToolbar from "../../common/SseToolbar";
import {
    ArrangeBringForward, ArrangeSendBackward, AutoFix, CallMerge, CheckOutline, ContentCut, CropLandscape,
    CursorDefaultOutline, DeleteForever, Download, Json, Looks, Redo, Undo, VectorPolygon, Exclamation, Close
} from 'mdi-material-ui';
import SseBranding from "../../common/SseBranding";

export default class SseToolbar2d extends SseToolbar {

    componentDidMount() {
        super.componentDidMount();
        this.addCommand("undoCommand", "Undo", false, "Ctrl+Z", "undo", Undo, "disabled");
        this.addCommand("redoCommand", "Redo", false, "Ctrl+Y", "redo", Redo, "disabled");
        this.addCommand("pointerCommand", "Manipulation Tool", 1, "Alt", "pointer", CursorDefaultOutline);
        this.addCommand("cutCommand", "Cut/Expand Tool", 1, "C", "cut", ContentCut, "disabled");
        this.addCommand("rectangleCommand", "Rectangle Tool", 1, "R", "rectangle", CropLandscape);
        this.addCommand("polygonCommand", "Polygon Tool", 1, "P", "polygon", VectorPolygon);
        this.addCommand("magicCommand", "Magic Tool", 1, "A", "flood", AutoFix);
        this.addCommand("deleteCommand", "Delete Selection", false, "Del", "delete", DeleteForever, "disabled");
        this.addCommand("downCommand", "Send Backward", false, "Down", "moveback", ArrangeSendBackward, "disabled");
        this.addCommand("upCommand", "Bring Forward", false, "Up", "movefront", ArrangeBringForward, "disabled");
        this.addCommand("mergeCommand", "Incomplete", false, "Incomplete", "merge", Exclamation );
        this.addCommand("followCommand", "Under Evalution", false, "Under Evaluation", "follow", Close );
        this.addCommand("enterCommand", "Labelled", false, "Labelled", "closepolygon", CheckOutline, "disabled");
        this.addCommand("jsonCommand", "Show JSON Output", false, "J", "openJsonView", Json);
        this.addCommand("downloadCommand", "Download", false, "Completed", "download", Download);
        this.sendMsg("pointer");
    }

    /* hardcoded function -------- */
    evaluation=()=>{
        console.log("under evaluation")
    }

    render() {
        return (
            <div className="hflex flex-justify-content-space-around sse-toolbar no-shrink">

                <SseBranding/>
                <div className="group">
                    {this.renderCommand("undoCommand")}
                    {this.renderCommand("redoCommand")}
                </div>
                <div className="group">
                    {this.renderCommand("pointerCommand")}
                    {this.renderCommand("cutCommand")}
                </div>
                <div className="group">
                    {/* {this.renderCommand("rectangleCommand")} */}
                    {this.renderCommand("polygonCommand")}
                    {this.renderCommand("magicCommand")}
                </div>
                <div className="group">
                    {this.renderCommand("deleteCommand")}
                    {/* {this.renderCommand("downCommand")}
                    {this.renderCommand("upCommand")} */}
                    {this.renderCommand("enterCommand")}
                    {this.renderCommand("mergeCommand")}
                    {/* {this.renderCommand("followCommand")} */}
                    
                    {/* hardcoded with style -------- */}
                    <div style={{textAlign:"center",cursor:'pointer'}} onClick={this.evaluation}>
                      <div>
                       <Close /> 
                     </div>
                     <div style={{position: 'relative', color: '#a9a9a9', fontSize: '9px',bottom: '-3px', margin:'0px 4px'}}>
                       Under evaluation
                     </div>
                    </div>
                    {/* --------hardcoded with style -------- */}

                </div>

                <div className="group">
                    {/* {this.renderCommand("jsonCommand")} */}
                    {this.renderCommand("downloadCommand")}
                </div>

            </div>
        )
    }


}