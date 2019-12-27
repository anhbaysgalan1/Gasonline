export default {
  translation: {
    app_name: "Gasonline",
    company_name: "SKE",

    Button: {
      login: "LOGIN",
      logout: "LOGOUT",
      remember: "Remember Me",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      detail: 'Detail',
      view: "View",
      back: "Back",
      close: 'Close',
      ok: "OK",
      clear: "Clear",
      cancel: "Cancel",
      save: "Save",
      update: "Update",
      print: "Print",
      exportPDF: 'PDF',
      divide: "Divide",
      confirm: "Confirm",
      remaining: "Remaining",
      generalDelivery: "General",
      separateDelivery: "Separate",
    },

    Sidebar: {
      area: 'Manage areas',
      customer: "Manage customers",
      delivery: "Delivery list",
      deliveryOthers: "Delivery others",
      divideOrder: "Divide orders",
      driver: "Manage drivers",
      order: "Manage orders",
      settingPrice: "Setting prices",
      remainingFuels: "Remaining Fuels",
      report: "Daily report",
      pouringFuels: "Poured Fuels Statistics",
      user: "Manage users",
      vehicle: "Manage vehicles",
    },

    Breadcrumb: {
      area: {
        index: "List areas",
        create: "Add new area",
        edit: "Edit area information"
      },

      customer: {
        index: "List customers",
        create: "Add new customer",
        edit: "Edit customer infomation",
        detail: "Customer information",
        history: "Customer history",
      },

      driver: {
        index: "List drivers",
        create: "Add new driver",
        edit: "Edit driver information",
        detail: "Driver information"
      },

      order: {
        index: "List orders",
        create: "Add new order",
        edit: "Edit order",
        detail: "Order details",
        divide: "Divide orders"
      },

      user: {
        index: "List users",
        create: "Add new user",
        edit: "Edit user information"
      },

      vehicle: {
        index: "List vehicles",
        create: "Add new vehicle",
        edit: "Edit vehicle information",
        detail: "Vehicle information"
      },

      settingPriceIndex: "Setting prices",
      reportIndex: "Report daily",
      delivery: "Delivery List",
      indexDelivery: "Add the number of delivery",
      generalDelivery: "General delivery",
      separateDelivery: "Separate delivery",
      deliveryOthers: "Delivery Others",
      pouredAmount: "Poured fuels into the tank",
      remainingAmount: "Remaining fuels"
    },

    Label: {
      all: "--All",
      amount: "Amount",
      chooseDate: "Choose report date",
      chooseSizePaper: "Choose paper size",
      chooseProduct: "Choose fuel products",
      createCustomerByPhone: "New customer: {{phone}}",
      date: "Date",
      discount: "Discount",
      actualRemainingFuel: "Actual Remaining Fuel",
      ordersNotDivided: "List orders are not divided",
      report: "Delivery Report",
      receivedVehicle: "Xe tiếp nhiên liệu",
      status: "Status",
      tax: "TAX",
      totalAmount: "Total Amount",

      customer: {
        mapTypeValue: {
          "1": "SKE",
          "2": "MC Center"
        },
        types: {
          direct: "SKE",
          mediate: "MC Center"
        },
        MCFlags: {
          A: "MC Center A",
          B: "MC Center B",
          C: "MC Center C",
        },
      },

      products: {
        adBlue: "Ad Blue",
        diesel: "Diesel",
        kerosene: "Kerosene",
        gasoline: "Gasoline",
        dieselFreeTax: "Diesel Free Tax",
      },

      taxes: {
        consumptionTax: "Consumption Tax",
        dieselTax: "Diesel Tax"
      },

      insurance: "Insurance",

      dateRange: {
        startMonth: "Day 01 - Day 15",
        endMonth: "Day 16 - Day 31"
      },

      driver: {
        deliverNumber: "Card Deliver Number",
        fuelNumber: "Card Fuel Number"
      },

      order: {
        title: "Orders",
        info: "Order Information",
        detail: "Order Detail Information",
        quantity: "Amount Fuel Order",
        expectNum: "Amount Fuel Expected",
        deliveryInfo: "Delivery Information",
      },

      statusOrder: {
        waiting: "Waiting",
        divided: "Divided",
        delivered: "Delivered",
        done: "Done"
      }
    },

    Input: {
      address: "Address",
      amount: "Amount",
      birthday: "Birthday",
      code: "Code",
      cost: "Cost",
      email: "Email",
      name: "Name",
      note: "Note",
      phone: "Phone",
      price: "Price",
      quantity: "Quantity",
      sex: "Sex",
      status: "Status",

      auth: {
        username: "Username",
        password: "Password",
        rePassword: "Re-Password"
      },

      area: {
        code: "Area code",
        name: "Area name"
      },

      customer: {
        code: "Customer Code",
        name: "Customer Name",
        type: "Type",
        extendPrice: "Extend Price",
        paymentTerm: "Payment Term",
        flag: "Flag"
      },

      order: {
        deliveryAddress: "Delivery Address",
        orderDate: "Order Date",
        deliveryDate: "Delivery Date",
        deliveryTime: "Delivery Time"
      },

      user: {
        username: "Username",
        code: "User Code",
        name: "Full Name",
        position: "Position",
        firstName: "First Name",
        lastName: "Last Name"
      },

      vehicle: {
        name: "Vehicle Model",
        licensePlate: "License Plate",
        driver: "Driver",
        capacity: "Capacity",
        remaining: "Fuel Remaining"
      }
    },

    Placeholder: {
      quantity: "Quantity",
      filter: {
        general: "Filter ...",
        date: "Choose date",
        dateRange: "Choose date range"
      }
    },

    Table: {
      action: "Actions",
      address: "Address",
      amount: "Amount",
      code: "Code",
      createdAt: "Created At",
      email: "Email",
      name: "Name",
      no: "No.",
      phone: "Phone Number",
      price: "Price",
      quantity: "Quantity",
      status: "Status",
      total: "Total",
      totalAmount: "Total Amount",

      area: {
        code: "Area Code",
        name: "Area Name"
      },

      customer: {
        code: "Customer Code",
        name: "Customer Name",
        type: "Types",
        extendPrice: "Extend Price",
        paymentTerm: "Payment Term"
      },

      driver: {
        code: "Driver Code",
        name: "Driver Name",
        cardNumber: "Card Number"
      },

      order: {
        orderDate: "Order Date",
        deliveryDate: "Delivery Date",
        deliveryTime: "Delivery Time",
        address: "Delivery Address",
        expectNum: "Expected Number",
        deliveryNum: "Delivered Number",
        fuel: "Fuel"
      },

      user: {
        username: "Username",
        code: "User Code",
        name: "Full Name",
        position: "Position",
        firstName: "First Name",
        lastName: "Last Name"
      },

      vehicle: {
        name: "Vehicle Model",
        licensePlate: "License Plate",
        driver: "Driver",
        capacity: "Capacity",
        remaining: "Fuel Remaining"
      }
    },

    Validate: {
      required: {
        base: 'This field is required',
        auth: {
          username: "Username is required",
          password: "Password is required",
        }
      },

      passwordNotMatch: "Password is not matching. Please enter again!",
      editFuelsTruck: "Dung tích phải lớn hơn nhiên liệu còn lại!",
      invalidFuelsOrder: "Số lượng dự kiến không được lớn hơn số lượng order",
      emptyFuelsOrder: "No amount of fuel ordered",
      emptyFuelsImport: "No amount of fuel is poured into the tank truck",
      emptyFuelsExport: "No amount of fuel is taken from the tank truck",
      min: "Vui lòng nhập giá trị nhỏ nhất là ${arguments[0]}",
      max: "Vui lòng nhập giá trị lớn nhất là ${arguments[0]}",
      minLength: "Vui lòng nhập tối thiểu ${arguments[0]} ký tự",
      maxLength: "Vui lòng nhập tối đa ${arguments[0]} ký tự",
      lessThan: "Vui lòng nhập giá trị nhỏ hơn ${arguments[0]}",
      greatThan: "Vui lòng nhập giá trị lớn hơn ${arguments[0]}",
      minDate: "Vui lòng nhập ngày lớn hơn ngày tối thiểu ${arguments[0]}",
      dateInvalid: "Vui lòng nhập ngày hợp lệ",
      phone: {
        minLength: "Vui lòng nhập số điện thoại lớn hơn ${arguments[0]} chữ số",
        maxLength: "Vui lòng nhập số điện thoại nhỏ hơn ${arguments[0]} chữ số"
      },
      truck: {
        capacity: "Vui lòng nhập dung tích lớn hơn nhiên liệu còn lại",
        remaining: "Vui lòng nhập nhiên liệu còn lại nhỏ hơn dung tích"
      }
    },

    Common: {
      deliveryTime: {
        morning: "AM",
        afternoon: "PM",
        anytime: "Anytime",
        unknown: "Unknown"
      }
    },

    Confirm: {
      delete: "Do you want to delete the selected rows?",
      updatePrice: "Do you want to update the prices?",
      completeOrder: "Do you want to complete the order?",
      logout: "Are you sure?"
    },

    Notification: {
      delete: "Data will not be recoverable after deletion, so be careful in this operation.",
      update: "Data will not be recoverable after changes, so please be careful in this operation.",
    },

    Message: {
      success: {
        create: "Create data successfully",
        update: "Update data successfully",
        delete: "Remove data successfully",
        // custom for another subject
        customer: {
          create: "Create customer successfully",
          update: "Update customer successfully"
        },
        order: {
          create: "Create order successfully",
          update: "Update order successfully"
        },
        group: {
          create: "Create group successfully",
        }
      },

      error: {
        base: "An error occurred. Please try again.",
      },

      divideOrder: {
        haveParams: "Order ${arguments[0]} has been saved. Click 'CONFIRM' to divide now!",
        invalidFuelsDialogTitle: "Not enough fuels",
        invalidFuelsDialogContent: "This tanker has insufficient ${name} to deliver orders. Do you want to continue?",
      }
    },

    Tooltip: {
      create: "Add new",
      edit: "Edit",
      editPrice: "Edit prices",
      updatePrice: "Update prices",
      detail: "View detail",
      delete: "Remove selected rows",
      exportCSV: "CSV",
      print: "Print",
      shareOrder: "Divide orders",
      deliver: "Deliver",
      completeOrder: "Complete"
    },

    Pagination: {
      backIconButtonText: 'Previous page',
      labelRowsPerPage: 'Rows per page:',
      labelDisplayedRows: ({from, to, count}) => `${from}-${to === -1 ? count : to} of ${count} ${count !== 1 ? 'items' : 'item'}`,
      nextIconButtonText: 'Next page'
    }
  }
}
