import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import UserContext from '../UserContext';
import { Link } from "react-router-dom"
import * as axios from 'axios';

const columns = [{
    dataField: 'name',
    text: 'Name',
    sort: true,
    headerStyle: () => {
      return { width: "20%" };
    }
  }, {
    dataField: 'propertyManager',
    text: 'Property Managers',
    sort: true,
    headerStyle: () => {
      return { width: "20%" };
    }
  }, {
    dataField: 'address',
    text: 'Address',
    sort: true,
    headerStyle: () => {
      return { width: "20%" };
    }
  }, {
    dataField: 'tenants',
    text: 'Tenants',
    sort: true,
    headerStyle: () => {
      return { width: "10%" };
    }
  }, {
    dataField: 'dateAdded',
    text: 'Added On',
    sort: true,
    headerStyle: () => {
      return { width: "10%" };
    }
}];

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  sort: true,
  headerColumnStyle: () => {
    return { width: "5%" };
  }
};


export class Properties extends Component {
    constructor(props) {
        super(props);

        this.state = {
        properties: [],
        filteredProperties: [],
        isFiltered: false
        }

        this.getProperties = this.getProperties.bind(this)
    }

    componentDidMount() {
        this.getProperties(this.context);
    }

    getProperties = (context) => {
        axios.get("/api/properties", { headers: {"Authorization" : `Bearer ${context.user.accessJwt}`} })
        .then((response) => {
            this.setState({properties: response.data.properties});
        })
        .catch((error) => {
            alert(error);
            console.log(error);
        })
    }

    searchProperties = () => {
      let allProperties = this.state.properties;
      let output = [];
      let searchQuery = document.getElementById("searchQuery").value.toLowerCase().trim();

       if(searchQuery.length > 0){
          for (var i=0;i < allProperties.length; i++) {
              let property = Object.values(allProperties[i]);
              property.shift();
              if (property.toString().toLowerCase().includes(searchQuery)){
                  output.push(allProperties[i]);
            }
          };

      this.setState({
            filteredProperties: output,
            isFiltered: true
          });
      }
  };

    clearSearch = () => {
      this.setState({isFiltered: false});
      document.getElementById("searchQuery").value = "";
    };

    enterSearchHandler = (event) => {
      var keyCode = event.keyCode;
      if (keyCode === 13){
        this.searchProperties();
      }
    };


    render() {
        return (
            <UserContext.Consumer>
                {session => {
                    this.context = session;
                    return (
                        <div className="properties__container">
                            <div className="section-header">
                                <h2 className="page-title">Properties</h2>
                                <Link className="button is-rounded" to="/add/property">+ ADD NEW</Link>
                            </div>
                            <div className="search-section">
                              <input className="input search is-rounded" id="searchQuery" onKeyDown={this.enterSearchHandler} placeholder="Search properties by name, address, or property manager"></input>
                                <button className="save_button button is-rounded" onClick={this.searchProperties}type="submit">
                                   Search
                                </button>
                                <button className="save_button button is-rounded clearButton" onClick={this.clearSearch}type="submit">
                                   Clear Search
                                </button>
                            </div>
                            <div className="properties-list">
                                <BootstrapTable
                                    keyField='id'
                                    data={ this.state.isFiltered === true ? this.state.filteredProperties : this.state.properties }
                                    columns={ columns }
                                    selectRow={ selectRow }
                                    bootstrap4={true}
                                    headerClasses="table-header"
                                    />
                            </div>
                        </div>
                    )
                }}
            </UserContext.Consumer>
        )
    }
}
