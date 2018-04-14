import Button from 'material-ui/Button';
import classes from '../../css/user-form.css';
import TextField from 'material-ui/TextField';
import React from 'react';
import axios from 'axios';
import Card, {CardContent} from 'material-ui/Card';
import {connect} from 'react-redux';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            userText: '',
            emailText: '',
            passwordText: '',
            passwordVerText: '',
            errUser: false,
            errEmail: false,
            errPassword: false,
            errPasswordVer: false,
            isValid: false,
        }
    }

    // research for validator
    validateUsername(event) {
        let input = event.target.value;
        let USERNAME_PATTERN = new RegExp('^[a-zA-Z0-9]$');
        // the max size of the input must be less than 100 to be passed into a hash function
        if (input.length < 6 && input.length < 100) {
            this.setState({errUser: true});
            this.setState({userText: "usernames must have least 6 characters"});
        } else if ((USERNAME_PATTERN.test(input))) {
            this.setState({errUser: true});
            this.setState({userText: "usernames can only contain letters and numebrs"});
        }
        else {
            this.setState({errUser: false});
            this.setState({userText: ""});
            this.setState({username: event.target.value});
        }
        this.isValid();

    }

    validateEmail(event){
        let input = event.target.value;
        let EMAIL_PATTERN ='/^\S+@\S+\.\S+$/';
        if (input.match(EMAIL_PATTERN)){
            this.setState({errEmail: true});
            this.setState({emailText: "emails must have the format of xxx@xxxx.xx"});
        }else{
            this.setState({errEmail: false});
            this.setState({emailText: ""});
            this.setState({email: event.target.value});
        }
        this.isValid();
    }

    validatePassword(event){

        let input = event.target.value;
        let PASSWORD_PATTERN = new RegExp('^[a-zA-Z0-9]$');
        if (input.length < 6) {
            this.setState({errPassword: true});
            this.setState({passwordText: "password must have least 6 characters"});
        } else if ((PASSWORD_PATTERN.test(input))) {
            this.setState({errPassword: true});
            this.setState({passwordText: "password can only contain letters and numebrs"});
        }
        else {
            this.setState({errPassword: false});
            this.setState({passwordText: ""});
            this.setState({password: input});
        }
        this.isValid();
    }

    validatePasswordVer(event){
       let input= event.target.value;
       if (input !== this.state.password){
           this.setState({errPasswordVer: true});
           this.setState({passwordVerText: "Password does not match"});
       }else{
           this.setState({errPasswordVer: false});
           this.setState({passwordVerText: ""});
       }
       this.isValid();
    }

    isValid(){
        if (!this.state.errEmail && !this.state.errUser && !this.state.errPassword && !this.state.errPasswordVer){
            console.log(!this.state.errEmail && !this.state.errUser && !this.state.errPassword);
            this.setState({isValid:true});
        }
    }

    handleClick() {
        var apiBaseUrl = "http://localhost:3001/";
        console.log("values", this.state.username, this.state.password, this.state.email);

        var payload = {
            "username": this.state.username,
            "email": this.state.email,
            "password": this.state.password
        };
        axios.post(apiBaseUrl + 'register', payload)
            .then(function (response) {
                console.log(response);
                if (response.data.success === true) {
                    console.log("registration successfull");
                   return this.props.onLogin();
                }
            })
            .catch(function (error) {
                console.log(error);
                return this.props.onLogout();
            });
    }

    render() {
        return (
            // determine if to use react aux to render multiple components

            <div className={classes["user-form"]}>
                <Card>
                    <CardContent className={classes["signup-card"]}>
                        <form>
                            <TextField
                                required
                                id="username"
                                label="UserName"
                                floatinglabeltext="UserName"
                                error={this.state.errUser}
                                helperText={this.state.userText}
                                onChange={(event) => (this.validateUsername(event))}
                                margin="normal"
                            />
                            <br/>
                            <TextField
                                id="email"
                                required
                                label="Email"
                                type="email"
                                floatinglabeltext="Email"
                                error={this.state.errEmail}
                                helperText={this.state.emailText}
                                onChange = {(event) => (this.validateEmail(event))}
                                margin="normal"
                            />
                            <br/>
                            <TextField
                                id="password"
                                required
                                type="password"
                                label="Password"
                                floatinglabeltext="Password"
                                error={this.state.errPassword}
                                helperText={this.state.passwordText}
                                onChange = {(event) => (this.validatePassword(event))}
                                margin="normal"
                            />
                            <br/>
                            <TextField
                                id="password_verify"
                                required
                                type="password"
                                label="Enter Password Again"
                                error={this.state.errPasswordVer}
                                helperText={this.state.passwordVerText}
                                floatinglabeltext="Password"
                                onChange = {(event) => (this.validatePasswordVer(event))}
                                margin="normal"
                            />
                            <br/>
                            <br/>
                            <Button disabled={!this.state.isValid} variant="raised" color='secondary' onClick={(event) => this.handleClick(event)}>
                                Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }// end of render
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogin: () => dispatch({type: 'LOGIN'}),
        onLogout: () => dispatch({type: 'LOGOUT'})
    };

};
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
