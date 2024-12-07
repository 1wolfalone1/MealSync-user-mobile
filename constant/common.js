export default commonConstants = {
  USER_ROLE: {
    USER: 1,
    SHOP: 2,
    GUEST: 0,
  },
  RejectStatus: {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
  },
  OrderIdentity: {
    ORDER_IDENTITY_SHOP_CANCEL: "ShopCancel",
    ORDER_IDENTITY_CUSTOMER_CANCEL: "CustomerCancel",
    ORDER_IDENTITY_DELIVERY_FAIL_BY_SHOP: "DeliveryFailByShop",
    ORDER_IDENTITY_DELIVERY_FAIL_BY_CUSTOMER: "DeliveryFailByCustomer",
    ORDER_IDENTITY_DELIVERY_FAIL_BY_CUSTOMER_REPORTED_BY_CUSTOMER:
      "DeliveryFailByCustomerReportedByCustomer",
    ORDER_IDENTITY_DELIVERY_FAIL_BY_SHOP_REPORTED_BY_CUSTOMER:
      "DeliveryFailByShopReportedByCustomer",
    ORDER_IDENTITY_DELIVERED_REPORTED_BY_CUSTOMER:
      "DeliveredReportedByCustomer",
  },
  ORDER_STATUS: {
    Pending: 1,
    Rejected: 2,
    Confirmed: 3,
    Cancelled: 4,
    Preparing: 5,
    Delivering: 6,
    Delivered: 7,
    FailDelivery: 8,
    Completed: 9,
    IssueReported: 10,
    UnderReview: 11,
    Resolved: 12,
  },
  url: {
    avatar:
      "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg",
  },
};
