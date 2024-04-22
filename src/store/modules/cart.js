import userModule from "./user";

const getDefaultState = () => {
  return {
    list: [],
    redirectToExamId: null,
    isCouponComponentVisible: false,
    checkCouponStatus: "emptyCoupon",
    couponCode: null,
    discountedModule: null,
  };
};

const state = getDefaultState();

// getters
const getters = {
  getList: (state) => {
    return [...state.list].reverse();
  },
  getNumberOfItems: (state) => {
    return state.list.length;
  },
  getTotalPrice: (state) => {
    return state.list.length == 0
      ? 0
      : state.list
          .reduce((t, { price, items }) => {
            if (!items) return t + price;

            return (
              t +
              price +
              items.reduce((subTotal, child) => subTotal + child.price, 0)
            );
          }, 0)
          .toFixed(2);
  },
  getTotalDiscountedPrice: (state) => {
    return state.list.length === 0
      ? 0
      : state.list
          .reduce((total, item) => {
            const discountPercentage = userModule.state.discountPercentage;
            const itemPrice = item.code ? item.discountedPrice : item.price;
            let discountedItemPrice = null;
            if (item.is_discounted) {
              discountedItemPrice =
                itemPrice - (itemPrice * discountPercentage) / 100;
            } else {
              discountedItemPrice = itemPrice;
            }

            if (!item.items) {
              let totalCartPrice =
                discountedItemPrice !== null
                  ? total + discountedItemPrice
                  : total + itemPrice;

              if (item.type == "ebook") {
                if ("bookBindingDiscount" in item) {
                  totalCartPrice = totalCartPrice - item.price;
                  return totalCartPrice;
                }
              }
              return totalCartPrice;
            }

            const subTotal = item.items.reduce((subTotal, child) => {
              if (child.bookBindingDiscount === 0) {
                const childPrice =
                  child.bookBindingDiscount === 0
                    ? child.bookBindingDiscount
                    : child.price;
                return subTotal + childPrice;
              } else {
                const childPrice = child.code
                  ? child.discountedPrice
                  : child.price;
                return subTotal + childPrice;
              }
            }, 0);

            let totalCartPrice =
              discountedItemPrice !== null
                ? total + discountedItemPrice + subTotal
                : total + itemPrice + subTotal;

            if (item.type == "ebook") {
              if ("bookBindingDiscount" in item) {
                totalCartPrice = totalCartPrice - item.price;
              }
            }

            return totalCartPrice;
          }, 0)
          .toFixed(2);
  },
  getRedirectToExamId: (state) => {
    return state.redirectToExamId;
  },
  getItemType: (state) => {
    return state.list.some((item) => item.type == "physical_product");
  },
  getCouponComponentVisible: (state) => {
    return state.isCouponComponentVisible;
  },
  getCouponStatus: (state) => {
    return state.checkCouponStatus;
  },
  getCouponCode: (state) => {
    return state.couponCode;
  },
};

// actions
const actions = {
  setList({ commit }, payload) {
    commit("setList", payload);
  },
  addItem({ commit, dispatch }, payload) {
    dispatch("ui/setCartActive", true, { root: true });

    const alreadyInCart = state.list.find(
      (item) => item.id === payload.id && item.type === payload.type
    );
    if (alreadyInCart && !payload.items) return;
    // will add it in future for multiple coupons
    // if (state.isCouponComponentVisible)
    //   commit("setCouponStatus", "emptyCoupon");
    const parsedPayload = {
      type: payload.type,
      id: payload.id,
      course_module_id: payload.course_module_id,
      name: payload.name,
      is_discounted: payload.is_discounted,
      salaryScaleDiscount: payload.salaryScaleDiscount,
      bookBindingDiscount: payload.bookBindingDiscount,
      price: payload.price,
      img: payload.img,
      items: payload.items,
      product_metas: payload.productMetas,
    };
    if (alreadyInCart?.code) {
      Object.assign(parsedPayload, {
        code: alreadyInCart.code,
        discountedAmount: alreadyInCart.discountedAmount,
        discountedPrice: alreadyInCart.discountedPrice,
        discountedType: alreadyInCart.discountedType,
      });
    }
    if (alreadyInCart) commit("updateItem", parsedPayload);
    else commit("addItem", parsedPayload);
  },
  removeItem({ commit }, payload) {
    commit("removeItem", payload);
    if (state.list.length === 0) {
      commit("clear");
    }
  },
  removeEnotes({ commit }, payload) {
    commit("removeEnotes", payload);
  },
  removeChildItem({ commit }, payload) {
    commit("removeChildItem", payload);
  },
  addRedirectToExamId({ commit }, payload) {
    commit("addRedirectToExamId", payload);
  },
  clear({ commit }) {
    commit("clear");
  },
  setCouponComponentVisibility({ commit }, payload) {
    commit("setCouponComponentVisibility", payload);
  },
  setCouponStatus({ commit }, payload) {
    commit("setCouponStatus", payload);
  },
  setCouponCode({ commit }, payload) {
    commit("setCouponCode", payload);
  },
};

// mutations
const mutations = {
  setDiscountedModule(state, payload) {
    state.discountedModule = payload;
  },
  setList(state, payload) {
    state.list = payload;
    saveToLocalStorage(state.list);
  },
  addItem(state, payload) {
    state.list.push(payload);
    saveToLocalStorage(state.list);
  },
  updateItem(state, payload) {
    state.list = state.list.map((item) => {
      if (!(item.id == payload.id && item.type == payload.type)) return item;
      return payload;
    });
    saveToLocalStorage(state.list);
  },
  removeItem(state, payload) {
    state.list = state.list.filter(
      (item) => !(item.id == payload.id && item.type == payload.type)
    );
    saveToLocalStorage(state.list);
  },
  removeEnotes(state, payload) {
    state.list = state.list.filter((item) => {
      if (item.id == payload.id && item.type == payload.type) {
        item.items = [];
        return item;
      } else {
        return item;
      }
    });
    saveToLocalStorage(state.list);
  },
  removeChildItem(state, payload) {
    state.list = state.list.map((item) => {
      if (!(item.id == payload.parent.id && item.type == payload.parent.type))
        return item;

      item.items = item.items.filter(
        (child) =>
          !(child.id == payload.child.id && child.type == payload.child.type)
      );
      if (!item.items.length) delete item["items"];

      return item;
    });
    saveToLocalStorage(state.list);
  },
  addRedirectToExamId(state, payload) {
    state.redirectToExamId = payload;
  },
  clear(state) {
    localStorage.removeItem("cart");
    localStorage.removeItem("isCouponComponentVisible");
    localStorage.removeItem("checkCouponStatus");
    localStorage.removeItem("couponCode");
    Object.assign(state, getDefaultState());
  },
  setCouponComponentVisibility(state, payload) {
    state.isCouponComponentVisible = payload;
    saveDataToLocalStorage(
      "isCouponComponentVisible",
      state.isCouponComponentVisible
    );
  },
  setCouponStatus(state, payload) {
    state.checkCouponStatus = payload;
    saveDataToLocalStorage("checkCouponStatus", state.checkCouponStatus);
  },
  setCouponCode(state, payload) {
    state.couponCode = payload;
    saveDataToLocalStorage("couponCode", state.couponCode);
  },
};

function saveToLocalStorage(data) {
  localStorage.setItem(
    "cart",
    JSON.stringify({
      items: data,
      timestamp: new Date().getTime(),
    })
  );
}
//todo: need optimization
function saveDataToLocalStorage(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      timestamp: new Date().getTime(),
    })
  );
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
