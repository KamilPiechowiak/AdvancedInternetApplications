import React from 'react'

class OrderOption extends React.Component {
    updateOrder = (event) => {
        const {value} = event.target
        const arr = value.split("-")
        this.props.updateHandler(this.props.name, {
            field: arr[0],
            direction: arr[1]
        })
    }
    render () {
        const options = []
        const direction = [
            { value: "-inc", name: "increasing"},
            { value: "-dec", name: "decreasing"}
        ]
        for(let i=0; i < this.props.fields.length; i++) {
            for(let j=0; j < 2; j++) {
                options.push(
                    <option 
                        value={this.props.fields[i]+direction[j].value}
                        key={this.props.fields[i]+direction[j].value}
                        >
                        {this.props.fields[i]+" "+direction[j].name}
                    </option>
                )
            }
        }
        const value = this.props.order.field + "-" + this.props.order.direction
        return (
            <div>
                <label for="order">Order by: </label>
                <select id="order"value={value} onChange={this.updateOrder}>
                    {options}
                </select>
            </div>
        )
    }
}

export default OrderOption