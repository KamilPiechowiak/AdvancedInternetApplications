import React from 'react'

class SearchBar extends React.Component {
    updateQuery = (event) => {
        this.props.updateHandler(this.props.name, event.target.value)
    }
    render() {
        return (
            <input
                type="text"
                name="query"
                placeholder="Search"
                value={this.props.query}
                onChange={this.updateQuery}
            />
        )
    }
}

export default SearchBar