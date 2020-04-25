import React from 'react';

import data from "./data/pokemons.json"
import SearchBar from './SearchBar'
import Item from "./Item"
import OrderOption from "./OrderOption"

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            list: data,
            query: "",
            order: {
                field: "id",
                direction: "inc"
            },
        }
        this.orderFields = ["id", "name", "description", "rating"]
        this.nextId = 7
    }

    addItem = () => {
        const item = {
            id: this.nextId++,
            name: "",
            description: "",
            imgUrl: "",
            rating: 5,
            types: "",
            editable: true
        }
        this.setState((prevState) => {
            return {list: prevState.list.concat([item])}
        })
    }

    saveItem = (item) => {
        this.setState((prevState) => {
            return {
                list : prevState.list.map(e => {
                    if(e.id === item.id) {
                        return item
                    }
                    return e
                })
            }
        })
    }

    removeItem = (item) => {
        this.setState((prevState) => {
            return {
                list: prevState.list.filter(e => e.id !== item.id)
            }
        })
    }

    updateStateFromChild = (name, value) => {
        console.log(name, value)
        this.setState({
            [name]: value
        })
    }

    compareItems = (a, b) => {
        const {field, direction} = this.state.order
        return ((a[field] > b[field]) === (direction === "inc"))
    }

    checkItem = (item) => {
        const q = this.state.query.toLowerCase()
        const fields = ["name", "description", "types"]
        for(let i=0; i < fields.length; i++) {
            if(item[fields[i]].toLowerCase().includes(q)) {
                return true
            }
        }
        return false
    }

    render() {
        const itemsList = this.state.list
            .sort(this.compareItems)
            .filter((item) => this.checkItem(item))
            .map((item) => <Item key={item.id} item={item} updateHandler={this.saveItem} removeHandler={this.removeItem}/>)
        console.log(this.state.list)
        return (
            <div>
                <h1>Pokemon collection system</h1>
                <div id="optionsBar">
                    <button onClick={this.addItem}>Add new Pokemon</button>
                    <SearchBar name="query" query={this.state.query} updateHandler={this.updateStateFromChild} />
                    <OrderOption name="order" order={this.state.order} fields={this.orderFields} updateHandler={this.updateStateFromChild}/>
                </div>
                { 
                    itemsList.length == 0 ? <p>There are no Pokemons in your collection</p> :
                    <table>
                        <tr><th>Name</th><th>Description</th><th>Image</th><th>Rating</th><th>Types</th><th>Actions</th></tr>
                        {itemsList}
                    </table>
                }
            </div>
        )
    }
}

export default App;
