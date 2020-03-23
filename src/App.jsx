import React from 'react';
import {Graph} from 'react-d3-graph'

export default class NetworkGraph extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      data:{
        nodes: [{ id: "N1" }, { id: "N2" }, { id: "N3" },  {id: "N4" }, {id: "N5" }, {id: "N6" }],
        links: [{ source: "N1", target: "N2" }, { source: "N1", target: "N3" }, {source:"N1", target:"N4"},
                { source: "N2", target: "N5" },{ source: "N4", target: "N6" },
                { source: "N3", target: "N4" }],
        automaticRearrangeAfterDropNode: true
      }
    };
  }
  
  componentDidMount(){   
    var urls = [];
    urls.push("http://localhost:8080/v1.0/topology/switches");
    urls.push("http://localhost:8080/v1.0/topology/links");
    urls.push("http://localhost:8080/v1.0/topology/hosts");
    Promise.all(urls.map(u=>fetch(u))).then(responses =>
      Promise.all(responses.map(res => res.json()))
    ).then(responseJSON => {

      var switch_list = responseJSON[0]; //get array of all switches
      var link_list = responseJSON[1]; // get array of all links
      var host_list = responseJSON[2]; // get array of all hosts
      
      var nodes = [];
      var links = [];
  
      //push switches into nodes
      switch_list.forEach(function(sdnSwitch){
        nodes.push({ "id": sdnSwitch.dpid, "type": "switch", "symbolType": "square" });
      });

      //push hosts into nodes
      host_list.forEach(function(host){
        nodes.push({"id":host.mac, "type":"host", "symbolType":"diamond"});
      })
      //push links
      link_list.forEach(function(link){
        links.push({"source":link.src.dpid, "target":link.dst.dpid});
      })
      host_list.forEach(function(host){
        links.push({"source":host.mac, "target":host.port.dpid});
      })
      console.log(nodes);
      console.log(links);
      this.setState({
        data : { "nodes": nodes, "links": links }
      });
    })
  }

  render() {
    return (
      <Graph
        id = {"some-id"}
        data = {this.state.data}
      />
  );
  }
}
