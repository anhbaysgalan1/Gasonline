import React from 'react';
import {StyleSheet, Document, Page, View, Text, Font} from '@react-pdf/renderer';
import {PDFViewer} from '@react-pdf/renderer';
// import { Table, TableHeader,  DataTableCell, TableBody } from '@david.kucsai/react-pdf-table'
import {I18n} from 'helpers/I18n';
import styled from '@react-pdf/styled-components';
import {BaseView} from 'views/BaseView';
// import {flexbox} from '@material-ui/system';

Font.register({
  family: 'JP',
  fonts: [
    {src: `http://localhost:3000/JPfont.ttf`},
  ]
});
Font.register({
  family: 'Roboto',
  fonts: [
    {src: `http://localhost:3000/robotoRegular.ttf`},
  ]
});

Font.registerHyphenationCallback(word => [word]);

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    fontFamily: "Roboto"
  },
  nameTypeCustomer: {
    width: "48%"
  },
  noNum: {
    width: "3%",
    borderLeftWidth: 1
  },
  nameCustomer: {
    width: "10%"
  },
  nameDriver: {
    width: "10%"
  },
  nameArea: {
    width: "7%"
  },
  spacingTable: {
    width: "1%",
    borderBottom: "none",
    borderTop: "none"
  },
  emptyCellBigTotalRow: {
    width: "75%",
    borderBottom: "none",
  },
  bigTotalHeader: {
    borderTopWidth: 1
  },
  fontSizeA3: {
    fontSize: 10
  },
  fontSizeA4: {
    fontSize: 7
  }
});

const Table = styled.View`
    font-family: Roboto;
    // display: flex;
    width: auto;
    `;
const TableColHeader = styled.View`
    width: 3%;
    border-style: solid;
    border-color: #000;
    border-bottom-color: #000;
    border-width: 1px;
    border-left-width: 0px;
    border-top-width: 1px;
    `;
const TableCol = styled.View`
    width: 3%;
    border-style: solid;
    border-color: #000;
    border-width: 1px;
    border-left-width: 0px;
    border-top-width: 0px;
    `;
const TableRow = styled.View`
    display: flex;
    margin: auto;
    flex-direction: row;
    `;
const TableCellHeader = styled.Text`
    margin: auto;
    // font-size: 10px;
    font-weight: 500;
    `;
const TableCell = styled.Text`
    margin: auto;
    // font-size: 10px;
    `;

// const maxOrder = 40;

// Create Document Component
export class MyDocument extends BaseView {
  constructor(props) {
    super(props)
    this.state = {reload: false}
  }

  filterSKEorders(orders) {
    return orders.filter(item => Number(item.type) === 1)
  }

  filterMCorders(orders) {
    return orders.filter(item => Number(item.type) === 2 || Number(item.type) === 3 || Number(item.type) === 4)
  }

  filterOrders(orders) {
    return orders.filter(item => Number(item.type) !== 5) //bỏ các đơn của khách hàng khác
  }

  renderCellHeader(name = "", style = {}) {
    return (
      <TableColHeader style={style}>
        <TableCellHeader>{name}</TableCellHeader>
      </TableColHeader>
    )
  }

  renderCellData(data = "", style = {}) {
    return (
      <TableCol style={style}>
        <TableCell>{data}</TableCell>
      </TableCol>
    )
  }

  renderRowHeaderTable() {
    return (
      <React.Fragment>
        {this.renderCellHeader(I18n.t("Table.customer.code"))}
        {this.renderCellHeader(I18n.t("Table.customer.name"), styles.nameCustomer)}
        {this.renderCellHeader(I18n.t("Table.header.area.code"))}
        {this.renderCellHeader(I18n.t("Table.header.area.name"), styles.nameArea)}
        {this.renderCellHeader(I18n.t("Table.driver.name"), styles.nameDriver)}
        {this.renderCellHeader(I18n.t("Label.products.diesel"))}
        {this.renderCellHeader(I18n.t("Label.products.dieselFreeTax"))}
        {this.renderCellHeader(I18n.t("Label.products.kerosene"))}
        {this.renderCellHeader(I18n.t("Label.products.gasoline"))}
        {this.renderCellHeader(I18n.t("Label.products.adBlue"))}
      </React.Fragment>
    )
  }

  renderRowTable(order) {
    let orderDetails = this.getData(order, "orderDetails", []);
    let diesel = orderDetails.find(item => String(item.name) === "diesel");
    let oil = orderDetails.find(item => String(item.name) === "oil");
    let gasoline = orderDetails.find(item => String(item.name) === "gasoline");
    let adBlue = orderDetails.find(item => String(item.name) === "adBlue");

    return (
      <React.Fragment>
        {this.renderCellData(this.getData(order, "customer.id", ""))}
        {this.renderCellData(this.getData(order, "customer.lastname", "") + " " + this.getData(order, "customer.firstname", ""), styles.nameCustomer)}
        {this.renderCellData(this.getData(order, "area.code", ""))}
        {this.renderCellData(this.getData(order, "area.name", ""), styles.nameArea)}
        {this.renderCellData(this.getData(order, "driver.lastname", "") + " " + this.getData(order, "driver.firstname", ""), styles.nameDriver)}
        {this.renderCellData(this.getData(diesel, "expectnum", ""))}
        {this.renderCellData("")}
        {this.renderCellData(this.getData(oil, "expectnum", ""))}
        {this.renderCellData(this.getData(gasoline, "expectnum", ""))}
        {this.renderCellData(this.getData(adBlue, "expectnum", ""))}
      </React.Fragment>
    )
  }

  renderData = (orders) => {
    let result = [];
    let MCorders = this.filterMCorders(orders);
    let SKEorders = this.filterSKEorders(orders);
    let max = Math.max(MCorders.length, SKEorders.length)

    for (let index = 0; index < max; index++) {
      let SKEorder = SKEorders[index] || {}
      let MCorder = MCorders[index] || {}
      result.push(
        <TableRow key={index}>
          {this.renderCellData(index + 1, styles.noNum)}
          {this.renderRowTable(SKEorder)}
          {this.renderCellData("", styles.spacingTable)}
          {this.renderRowTable(MCorder)}
        </TableRow>
      )
    }
    return result;
  }

  calculateTotal(orders) {
    let total = {
      diesel: 0,
      oil: 0,
      gasoline: 0,
      adBlue: 0
    };
    orders.map(order => {
      order.orderDetails.map(item => {
        total[item.name] += item.expectnum;
      })
    })

    return {
      orderDetails: [
        {name: "diesel", expectnum: total.diesel},
        {name: "oil", expectnum: total.oil},
        {name: "gasoline", expectnum: total.gasoline},
        {name: "adBlue", expectnum: total.adBlue}
      ]
    }
  }

  renderTotal(orders) {
    let SKEorders = this.filterSKEorders(orders);
    let MCorders = this.filterMCorders(orders);

    return (
      <TableRow>
        {this.renderCellData(I18n.t("Table.header.total"), styles.noNum)}
        {this.renderRowTable(this.calculateTotal(SKEorders))}
        {this.renderCellData("", styles.spacingTable)}
        {this.renderRowTable(this.calculateTotal(MCorders))}
      </TableRow>
    )
  }

  renderBigTotal(orders) {
    let total = this.calculateTotal(this.filterOrders(orders));

    return (
      <React.Fragment>
        <TableRow style={{marginTop: "20px"}}>
          {this.renderCellData("", styles.emptyCellBigTotalRow)}
          {this.renderCellHeader(I18n.t("Table.header.total"), {
            ...styles.nameDriver,
            borderBottomWidth: 0,
            borderTopWidth: 1
          })}
          {this.renderCellHeader(I18n.t("Label.products.diesel"), styles.bigTotalHeader)}
          {this.renderCellHeader(I18n.t("Label.products.dieselFreeTax"), styles.bigTotalHeader)}
          {this.renderCellHeader(I18n.t("Label.products.kerosene"), styles.bigTotalHeader)}
          {this.renderCellHeader(I18n.t("Label.products.adBlue"), styles.bigTotalHeader)}
          {this.renderCellHeader(I18n.t("Label.products.diesel"), styles.bigTotalHeader)}
        </TableRow>
        <TableRow>
          {this.renderCellData("", styles.emptyCellBigTotalRow)}
          {this.renderCellData("", styles.nameDriver)}
          {this.renderCellData(total.orderDetails[0].expectnum)}
          {this.renderCellData("")}
          {this.renderCellData(total.orderDetails[1].expectnum)}
          {this.renderCellData(total.orderDetails[2].expectnum)}
          {this.renderCellData(total.orderDetails[3].expectnum)}
        </TableRow>
      </React.Fragment>
    )
  }

  renderTitle(date = "") {
    return (
      <React.Fragment>
        <View>
          <Text>
            {I18n.t("company_name")}
          </Text>
        </View>
        <View>
          <Text style={{textAlign: "center", fontSize: this.props.size === "A3" ? 18 : 13}}>
            {I18n.t("Label.report")}
          </Text>
        </View>
        <View>
          <Text style={{textAlign: "right"}}>
            {date}
          </Text>
        </View>
      </React.Fragment>
    )
  }

  render() {
    const {orders} = this.props;
    console.log("orders", orders)
    return (
      <div style={{width: "100%", height: "100vh"}}>
        <PDFViewer width="100%" height="100%">
          <Document>
            <Page size={this.props.size} orientation="landscape"
                  style={[styles.page, this.props.size === "A3" ? styles.fontSizeA3 : styles.fontSizeA4]}>
              {this.renderTitle(this.props.date)}
              <Table>
                <TableRow style={{borderTopWidth: "1px"}}>
                  {this.renderCellHeader("", styles.noNum)}
                  {this.renderCellHeader(I18n.t("Label.customer.types.direct"), styles.nameTypeCustomer)}
                  {this.renderCellData("", styles.spacingTable)}
                  {this.renderCellHeader(I18n.t("Label.customer.types.mediate"), styles.nameTypeCustomer)}
                </TableRow>
                <TableRow>
                  {this.renderCellHeader(I18n.t("Table.no"), styles.noNum)}
                  {this.renderRowHeaderTable()}
                  {this.renderCellData("", styles.spacingTable)}
                  {this.renderRowHeaderTable()}
                </TableRow>
                {this.renderData(orders)}
                {this.renderTotal(orders)}
                {this.renderBigTotal(orders)}
              </Table>
            </Page>
          </Document>
        </PDFViewer>
      </div>
    )
  }
}
