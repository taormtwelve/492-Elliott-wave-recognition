import React from "react";
import anychart from 'anychart'
import axios from "../axios";

var qoute = window.location.pathname.replace('/graph/','')
var chart, series;

export default class Graphpage extends React.Component{
    state = {
        idx: 0,
    }

    getChart(idx){
        document.getElementById('container').innerHTML = ""
        axios.get('/quote/'+qoute+'/'+idx).then(res =>{
            this.setState({
                data:res.data.historical,
                idx:res.data.idx,
                predict: null
            })
            chart = null
            chart = anychart.stock();
            series = chart.plot(0).candlestick(this.state.data);
            series.name("Elliott wave recognition");
            series.fallingFill("red");
            series.fallingStroke("red");
            series.risingFill("green");
            series.risingStroke("green");
            chart.title(qoute);
            chart.container('container');
            chart.draw();

        }).catch(err =>console.log(err))
    }

    componentDidMount(){
        this.getChart(this.state.idx)
    }

    onClick = (event) =>{
        const id = event.target.id;
        let idx
        if (id === "prev"){
            idx = this.state.idx-1
        }else{
            idx = this.state.idx+1
        }
        axios.get('/quote/'+qoute+'/'+idx).then(res =>{
            this.setState({
                data:res.data.historical,
                idx:res.data.idx
            })
        }).catch(err =>console.log(err))
        this.getChart(idx)
        return
    }

    onPredict = () =>{
        
        let idx = (this.state.idx).toString()
        axios.get('/predict/'+qoute+'/'+idx).then(res => {
            this.setState({predict: res.data.predict})
        }).catch(err => console.log(err))
    }

    render(){
        return(
            <div>
                <div className="card" style={{"height":"500px", "width": "80%", "margin": "auto", "top": "20px"}}>
                    <div className="card-body" style={{"margin":"auto","height":"85%", "width": "80%"}}>
                    <div id="container"></div></div>
                    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <button id="prev" type="button" onClick={this.onClick} className="btn btn-light" style={{"margin":"auto","width": "150px"}}>Prev</button>
                        <button type="button" className="btn btn-success" onClick={this.onPredict} style={{"margin":"auto","width": "150px"}}>Predict pattern</button>
                        <button id="next" type="button" onClick={this.onClick} className="btn btn-light" style={{"margin":"auto","width": "150px"}}>Next</button>
                    </div>

                    <div style={{"margin":"auto", "height": "30px"}}>{this.state && this.state.predict? "Predict : " + this.state.predict : ""}</div>
                </div>
            </div> 
        )
    }
}