import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Profile from './github/Profile';
import Search from './github/Search';
import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'basilmeer',
      userData: [],
      userRepos: [],
      perPage: 10
    }
  }

  // Get user data from Github
  getUserData() {
    $.ajax({
      url: 'https://api.github.com/users/' + this.state.username + 
            '?client_id=' + this.props.clientId + '&client_secret=' + 
            this.props.clientSecret,
      dataType: 'jsonp',
      crossDomain: true,
      cache: false,
      success: function(data) {
        this.setState({userData: data.data});
        console.log(data.data);
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({username: null});
        alert(err);
      }.bind(this)
    });
  }

  // Get user repo list from Github
  getUserRepos() {
    $.ajax({
      url: 'https://api.github.com/users/' + this.state.username + 
      '/repos?per_page='+ this.state.perPage +'&client_id=' + 
      this.props.clientId + '&client_secret=' + this.props.clientSecret +
      '&sort=created',
      dataType: 'jsonp',
      crossDomain: true,
      cache: false,
      success: function(data) {
        // Change the userRepos state to the fetched data
        this.setState({userRepos: data.data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({userRepos: null});
        alert(err);
      }.bind(this)
    });
  }

  // Handle form submissions
  handleFormSubmit(username) {
    // Set the username state to the form one and refresh the user data
    this.setState({username: username}, () => {
      this.getUserData();
      this.getUserRepos();
    })
  }

  // Do stuff if component mounts
  componentDidMount() {
    this.getUserData();
    this.getUserRepos();
  }
  
  // Show content on the page
  render() {
    // console.log(this.props);
    return(
      <div>
        <Search onFormSubmit={this.handleFormSubmit.bind(this)} {...this.props} />
        <Profile {...this.state} />
      </div>
    )
  }
}

// App PropTypes
App.propTypes = {
  clientId: PropTypes.string,
  clientSecret: PropTypes.string
}

// App default props
App.defaultProps = {
  clientId: '38f24864ee4c66704a05',
  clientSecret: '81e8714b968a0fd993f9d4dc0962ca883b99c8ea'
}

export default App;