import * as React from 'react';

import {connect} from "react-redux";

import {Button, Divider, Form, Header, Icon} from "semantic-ui-react";

import {configuration, DefaultProps, Store} from "../redux";

import LoadingButton from "../components/LoadingButton";
import {ReadConfigParams, SaveConfigParams} from "../redux/actions/Configuration";

export interface ConfigurationLocalProps extends DefaultProps {
    config: {
        read: {
            isLoading: boolean,
            response: any,
            error: string
        },
        save: {
            isLoading: boolean,
            response: string,
            error: string
        }
    },
    handleSaveConfig: (data: SaveConfigParams) => void;
    handleReadConfig: (data: ReadConfigParams) => Promise<any>;
    dataDirectory: string;
}

interface State {
    host: string,
    port: string,
    gas: string,
    gasprice: string,
    from: string,
    keystore: string
}

class Configuration extends React.Component<ConfigurationLocalProps, State> {
    public state = {
        host: '',
        port: '',
        gas: '',
        gasprice: '',
        from: '',
        keystore: ''
    };

    public componentDidMount = () => {
        const {response} = this.props.config.read;
        if (response) {
            this.setVars(response)
        } else {
            this.handleReadConfig();
        }
    };

    public setVars(response: any) {
        this.setState({
            host: response.defaults.host,
            port: response.defaults.port,
            from: response.defaults.from,
            gas: response.defaults.gas,
            gasprice: response.defaults.gasprice,
            keystore: response.defaults.keystore
        });
    }

    public handleConfigSave = () => {
        this.props.handleSaveConfig({
            dataDirectoryPath: this.props.dataDirectory,
            defaults: this.state
        });
    };

    public handleReadConfig = () => {
        this.props.handleReadConfig({dataDirectoryPath: this.props.dataDirectory})
            .then((config) => this.setVars(config));
    };

    public render() {
        console.log(this.state);
        const {config} = this.props;
        return (
            <React.Fragment>
                <Header as={"h2"}>
                    Configuration
                    <Header.Subheader>
                        /Users/danu/.evmlc/config.toml
                        <br/><br/>
                        <LoadingButton right={false} isLoading={config.read.isLoading}
                                       onClickHandler={this.handleReadConfig}/>
                    </Header.Subheader>
                </Header>
                <Divider hidden={true}/>
                {config.read.response &&
                (<div className={'page'}>
                    <Header as={"h3"}>
                        Connection
                    </Header>
                    <Divider/>
                    <Form>
                        <Form.Field>
                            <label>Host</label>
                            <input defaultValue={config.read.response.defaults.host}
                                   onChange={(e) => this.setState({host: e.target.value})}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Port</label>
                            <input defaultValue={config.read.response.defaults.port}
                                   onChange={(e) => this.setState({port: e.target.value})}/>
                        </Form.Field>
                    </Form>
                    <Header as={"h3"}>
                        Defaults
                    </Header>
                    <Divider/>
                    <Form>
                        <Form.Field>
                            <label>From</label>
                            <input defaultValue={config.read.response.defaults.from}
                                   onChange={(e) => this.setState({from: e.target.value})}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Gas</label>
                            <input defaultValue={config.read.response.defaults.gas}
                                   onChange={(e) => this.setState({gas: e.target.value})}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Gas Price</label>
                            <input defaultValue={config.read.response.defaults.gasprice}
                                   onChange={(e) => this.setState({gasprice: e.target.value})}/>
                        </Form.Field>
                    </Form>
                    <Header as={"h3"}>
                        Directory
                    </Header>
                    <Divider/>
                    <Form>
                        <Form.Field>
                            <label>Keystore</label>
                            <input defaultValue={config.read.response.defaults.keystore}
                                   onChange={(e) => this.setState({keystore: e.target.value})}/>
                        </Form.Field>
                    </Form>
                    <Divider hidden={true}/>
                    <Form>
                        <Form.Field>
                            {config.save.isLoading &&
                            (<span className={"m-2"}>
                                <Icon color={"green"} name={"circle notch"}
                                      loading={true}/> Saving...<br/><br/></span>)}
                            {!config.save.isLoading && config.save.response &&
                            (<span className={"m-2"}>
                                    <Icon color={"green"} name={"thumbs up"}
                                          loading={false}/>{config.save.response}<br/><br/></span>)}
                            <Button onClick={this.handleConfigSave} color={'green'}>Save</Button>
                        </Form.Field>
                    </Form>
                </div>)}
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    config: store.config,
    dataDirectory: store.app.dataDirectory.response,
});

const mapDispatchToProps = (dispatch: any) => ({
    handleSaveConfig: (data: SaveConfigParams) => dispatch(configuration.handleSaveConfig(data)),
    handleReadConfig: (data: ReadConfigParams) => dispatch(configuration.handleReadConfig(data)),
});

export default connect(mapStoreToProps, mapDispatchToProps)(Configuration);