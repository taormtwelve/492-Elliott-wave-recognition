import axios from '../axios';
import React from 'react';

const stocks_name = ['ADVANC', 'AIT', 'DELTA', 'DTAC', 'FORTH', 'HANA', 'HUMAN', 'ILINK', 'INET', 'JAS'
, 'JMART', 'KCE', 'MFEC', 'NEX', 'SAMART', 'SIS', 'SVOA', 'TEAM', 'TRUE']

export default class Homepage extends React.Component{

    state = {}

    async componentDidMount(){
        let stocks = []
        await stocks_name.map(name => 
            axios.get('/ticker/'+name+'.BK').then(res =>{
                stocks.push(res.data.stock)
                this.setState({stocks:stocks})
            }).catch(err => console.log(err))
        )
    }

    render(){
        if(this.state.stocks)
            return(
                <div>
                    <div className="card" style={{"width": "95%", "margin": "auto", "top": "30px"}}>
                        <div className="card-body" >
                            <table className="table">
                            <thead>
                                <tr>
                                <th style={{"width": "20%","text-align": "center"}} scope="col">Name</th>
                                <th style={{"width": "20%","text-align": "center"}} scope="col">Last</th>
                                <th style={{"width": "20%","text-align": "center"}} scope="col">Change</th>
                                <th style={{"width": "20%","text-align": "center"}} scope="col">Bid</th>
                                <th style={{"width": "20%","text-align": "center"}} scope="col">Ask</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.stocks.map(stock => 
                                    <tr id={stock.name}>
                                        <td style={{"width": "20%","text-align": "center"}}> <a style={{"color":"black", "text-decoration":"none"}}href={`/graph/`+stock.name}>{(stock.name)}</a></td>
                                        <td style={{"width": "20%","text-align": "center"}}>{(stock.price).toFixed(2)}</td>
                                        <td style={stock.per_chg > 0? {"color":"green","width": "20%","text-align": "center"}:{"color":"red","width": "20%","text-align": "center"}}>{(stock.per_chg).toFixed(2)}%</td>
                                        <td style={{"width": "20%","text-align": "center", "color":"green"}}>{(stock.bid).toFixed(2)}</td>
                                        <td style={{"width": "20%","text-align": "center", "color":"red"}}>{(stock.ask).toFixed(2)}</td>
                                    </tr>
                                )}
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
        else return(
            <div>
                <div className="card" style={{"width": "95%", "margin": "auto", "top": "30px"}}>
                    <div className="card-body" >
                        <table className="table">
                        <thead>
                            <tr>
                            <th style={{"width": "20%","text-align": "center"}} scope="col">Name</th>
                            <th style={{"width": "20%","text-align": "center"}} scope="col">Last</th>
                            <th style={{"width": "20%","text-align": "center"}} scope="col">%Change</th>
                            <th style={{"width": "20%","text-align": "center"}} scope="col">Bid</th>
                            <th style={{"width": "20%","text-align": "center"}} scope="col">Ask</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}