import React from "react";
import axios from "../axios";

export default class Header extends React.Component{

    state = {}

    async componentDidMount(){
        await axios.get('/setindex').then(res =>{
            this.setState({
                setindex: res.data.setindex
            })
        }
        ).catch((err) => alert(err))
    }
    
    render(){
        if(this.state.setindex)
            return(
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                
                <a className="navbar-brand" href="/"><h1>SET</h1></a>
                <ul className="navbar-nav ">
                    <a className="nav-link disabled" style={{"color":"white"}}><h1>{(this.state.setindex.index).toFixed(2)}</h1></a>
                    <a className="nav-link disabled" style={this.state.setindex.chg > 0? {"color":"green"}:{"color":"red"}}>{this.state.setindex.chg > 0?'+':''}{(this.state.setindex.chg).toFixed(2)}</a>
                    <a className="nav-link disabled" style={this.state.setindex.chg > 0? {"color":"green"}:{"color":"red"}}>{this.state.setindex.chg > 0?'+':''}{(this.state.setindex.per_chg).toFixed(2)}%</a>
                </ul> 
                    <a className="nav-link disabled" style={{"color":"white"}}><h5>OPEN : {(this.state.setindex.O).toFixed(2)}</h5></a>
                    <a className="nav-link disabled" style={{"color":"green"}}><h5>High : {(this.state.setindex.H).toFixed(2)}</h5></a>
                    <a className="nav-link disabled" style={{"color":"red"}}><h5>LOW : {(this.state.setindex.L).toFixed(2)}</h5></a>
                    <a className="nav-link disabled" style={{"color":"blue"}}><h5>VOLUMN : {(this.state.setindex.vol).toFixed(2)}</h5></a>
                </div>
                </nav>
            )
    else return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
            </div>
        </nav>
    )
    }
}