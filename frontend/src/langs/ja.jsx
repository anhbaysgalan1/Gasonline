export default {
  translation: {
    app_name: "SKE 受注配車システム",
    company_name: "株式会社SKE",

    Button: {
      login: "ログイン",
      logout: "ログアウト",
      remember: "アカウントを記憶します",
      create: "作成",
      edit: "編集",
      delete: "削除",
      detail: "詳細",
      view: "閲覧",
      back: "戻る",
      close: "閉じる",
      ok: "OK",
      clear: "クリア",
      cancel: "キャンセル",
      save: "保存",
      update: "更新",
      print: "印刷",
      exportPDF: 'PDF出力',
      divide: "区分",
      confirm: "確認",
      remaining: "残量",
      generalDelivery: "合計",
      separateDelivery: "個別",
    },

    Sidebar: {
      area: "エリア",
      customer: "顧客",
      delivery: "配送一覧",
      deliveryOthers: "その他の配達一覧",
      divideOrder: "受注配車",
      driver: "ドライバー",
      order: "注文",
      settingPrice: "原価設定",
      remainingFuels: "残量",
      report: "日報",
      pouringFuels: "積込数量",
      user: "ユーザー",
      vehicle: "配送車",
      invoice: "請求書",
      customerOrders: "顧客別注文量",
    },

    Breadcrumb: {
      area: {
        index: "エリア一覧",
        create: "エリア追加",
        edit: "エリアの情報編集"
      },

      customer: {
        index: "顧客一覧",
        create: "顧客追加",
        edit: "顧客編集",
        detail: "顧客詳細",
        history: "顧客履歴",
      },

      driver: {
        index: "ドライバー一覧",
        create: "ドライバー追加",
        edit: "ドライバー情報の編集",
        detail: "ドライバー詳細"
      },

      order: {
        index: "注文一覧",
        create: "注文追加",
        edit: "注文編集",
        detail: "注文詳細",
        divide: "受注配車",
      },

      user: {
        index: "ユーザー一覧",
        create: "ユーザー追加",
        edit: "ユーザー情報の編集"
      },

      vehicle: {
        index: "配送車一覧",
        create: "配送車追加",
        edit: "配送車編集",
        detail: "配送車の詳細"
      },

      settingPriceIndex: "原価設定",
      invoice: "請求書",
      customerOrders: "顧客別注文量",
      reportIndex: "日報",
      delivery: "納品一覧",
      indexDelivery: "配送済数量追加",
      generalDelivery: "合計",
      separateDelivery: "個別追加",
      deliveryOthers: "その他の配達一覧",
      pouredAmount: "積込数量",
      remainingAmount: "残量"
    },

    Label: {
      all: "全部",
      amount: "金額",
      chooseDate: "日付選択",
      chooseSizePaper: "用紙サイズ選択",
      chooseProduct: "商品選択",
      createCustomerByPhone: "新規顧客: {{phone}}",
      date: "日付",
      month: "月",
      discount: "割引",
      actualRemainingFuel: "実際の残量燃料",
      ordersNotDivided: "未配車注文一覧",
      report: "配達日報一覧",
      receivedVehicle: "車番",
      status: "状態",
      tax: "税金",
      totalAmount: "合計",
      endMonth: "月末",

      customer: {
        mapTypeValue: {
          '1': 'SKE',
          '2': 'エムシーセンター'
        },
        types: {
          direct: "SKE",
          mediate: "エムシーセンター"
        },
        MCFlags: {
          A: "エムシーセンター A",
          B: "エムシーセンター B",
          C: "エムシーセンター C",
        },
      },

      products: {
        adBlue: "アドブルー",
        diesel: "軽油",
        kerosene: "灯油",
        gasoline: "レギュラー",
        dieselFreeTax: "免税軽油"
      },

      taxes: {
        consumptionTax: "消費税",
        dieselTax: "軽油税"
      },

      insurance: "保証",
      insuranceFee: "保証金額",

      dateRange: {
        startMonth: "1日 - 15日",
        endMonth: "16日 - 31日",
        fromDate: "から",
        toDate: "まで"
      },

      driver: {
        deliverNumber: '配送燃料カード',
        fuelNumber: 'ガソリンカード'
      },

      order: {
        title: "注文",
        info: "注文情報",
        detail: "注文詳細",
        quantity: "注文数量",
        expectNum: "予定納品数量",
        deliveryInfo: "配送情報",
      },

      statusOrder: {
        waiting: "配車待ち",
        divided: "配車済",
        delivered: "配達済",
        done: "済"
      }
    },

    Input: {
      address: "住所",
      amount: "金額",
      birthday: "生年月日",
      code: "コード",
      cost: "購入価格",
      email: "メールアドレス",
      name: "名前",
      note: "備考",
      phone: "電話番号",
      price: "販売価格",
      quantity: "数量",
      sex: "性別",
      status: "状態",

      auth: {
        username: "アカウント",
        password: "パスワード",
        rePassword: "パスワードの再入力"
      },

      area: {
        code: "エリアコード",
        name: "エリア"
      },

      customer: {
        code: "顧客コード",
        name: "顧客名",
        type: "タイプ",
        extendPrice: "単価",
        paymentTerm: "締日",
        flag: "Flag"
      },

      order: {
        deliveryAddress: "配達場所",
        orderDate: "注文日",
        deliveryDate: "配達日付",
        deliveryTime: "配達時間"
      },

      user: {
        username: "アカウント",
        code: "ユーザーコード",
        name: "ユーザー名",
        position: "役職",
        firstName: "姓",
        lastName: "名"
      },

      vehicle: {
        name: "配送車",
        licensePlate: "車番",
        driver: "ドライバー名",
        capacity: "容積",
        remaining: "残量"
      }
    },

    Placeholder: {
      quantity: "数量",
      filter: {
        general: "検索",
        date: "選択する",
        dateRange: "時間範囲を選択する"
      }
    },

    Table: {
      action: "動作",
      address: "住所",
      amount: "金額",
      code: "コード",
      createdAt: "作成日",
      email: "メールアドレス",
      name: "名称",
      no: "NO.",
      phone: "電話番号",
      price: "販売価格",
      quantity: "数量",
      status: "状態",
      total: "総合計",
      totalAmount: "合計",

      area: {
        code: "エリアコード",
        name: "イリア"
      },

      customer: {
        code: "顧客コード",
        name: "顧客名",
        type: "タイプ",
        extendPrice: "単価",
        paymentTerm: "締日"
      },

      driver: {
        code: "コード",
        name: "ダライバー名",
        cardNumber: "カード番号"
      },

      order: {
        orderDate: "注文日付",
        deliveryDate: "配達日付",
        deliveryTime: "配達時間",
        address: "住所",
        expectNum: "予定納品数量",
        deliveryNum: "配達数量",
        fuel: "燃料"
      },

      user: {
        username: "アカウント",
        code: "ユーザーコード",
        name: "ユーザー名",
        position: "役職",
        firstName: "姓",
        lastName: "名"
      },

      vehicle: {
        name: "配送車名",
        licensePlate: "ナンバー",
        driver: "ドライバー名",
        capacity: "容積",
        remaining: "残量"
      }
    },

    Validate: {
      required: {
        base: 'この項目は必須項目です。',
        auth: {
          username: "この項目は必須項目です。",
          password: "この項目は必須項目です。",
        },
      },

      passwordNotMatch: "パスワードが一致しません。再入力してください !",
      editFuelsTruck: "容積は残量よりも大きくしてください",
      invalidFuelsOrder: "予定数量は注文数量より大きくすることはできません",
      emptyFuelsOrder: "予定数量がまだ入力されていません",
      emptyFuelsImport: "少なくとも１つの燃料種類に数量入力する必要があります。",
      emptyFuelsExport: "少なくとも１つの燃料種類に数量入力する必要があります。",
      min: "入力可能の最小値は${arguments[0]}です。",
      max: "入力可能の最大値は${arguments[0]}です。",
      minLength: "${arguments[0]}桁以上に入力してください。",
      maxLength: "${arguments[0]}桁以下に入力してください。",
      lessThan: "${arguments[0]}より小さいな値を入力してください。",
      greatThan: "${arguments[0]}より大きいな値を入力してください。",
      minDate: "入力可能の最小値は ${arguments[0]}です",
      dateInvalid: "有効な日付を入力してください。",
      phone: {
        minLength: " 電話番号の項目に${arguments[0]}桁以上に入力してください",
        maxLength: " 電話番号の項目に${arguments[0]}桁以下に入力してください"
      },
      truck: {
        capacity: "容積の項目に残量より大きな値を入力してください",
        remaining: "残量の項目に容積より小さいな値を入力してください"
      },
    },

    Common: {
      deliveryTime: {
        morning: "AM",
        afternoon: "PM",
        anytime: "いつでも",
        unknown: "不明"
      }
    },

    Confirm: {
      delete: "選択したデータを削除してよろしいですか。",
      updatePrice: "単価を更新したいですか。",
      completeOrder: "この受注の状態が完了に変更されますがよろしいでしょう？",
      logout: "ログアウトしますが、よろしいでしょうか？"
    },

    Notification: {
      delete: "削除したデータを復元することはできませんので、ご注意ください。",
      update: "削除したデータを復元することはできませんので、ご注意ください。",
    },

    Message: {
      success: {
        create: "データが追加されました。",
        update: "データが更新されました。",
        delete: "データが削除されました。",
        // custom for another subject
        customer: {
          create: "新顧客が追加されました",
          update: "顧客が更新されました"
        },
        order: {
          create: "新しい注文が追加されました",
          update: "注文が更新されました",
        },
        group: {
          create: "新しいグループが追加されました。",
        }
      },

      error: {
        base: "エラーが発生しましたので、もう一度お試しください。",
      },

      divideOrder: {
        haveParams: "注文$ {arguments [0]}は保存されました。 今すぐ分区するには「確認」をクリックしてください。",
        invalidFuelsDialogTitle: "燃料が足りません",
        invalidFuelsDialogContent: "${name}の配送車の容積が足りないので、この注文を加えて配達できませんが、引き続けますか？"
      },
    },

    Tooltip: {
      create: "作成",
      edit: "情報編集",
      editPrice: "単価編集",
      updatePrice: "単価更新",
      detail: "詳細",
      delete: "削除",
      exportCSV: "CSVへ出力",
      print: "印刷",
      shareOrder: "配車",
      deliver: "配達",
      completeOrder: "配達を完了する"
    },

    Pagination: {
      backIconButtonText: '前のページ',
      labelRowsPerPage: '表示:',
      labelDisplayedRows: ({ from, to, count }) => `${from}-${to === -1 ? count : to} / ${count} 件`,
      nextIconButtonText: '次のページ',
      noData: "見つかりません"
    }
  }
}
