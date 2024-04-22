import { state } from "./cart";

// actions
const actions = {
  setList({ commit }, payload) {
    commit("setList", payload);
  },
  foundBindedModule({ getters, dispatch }, courseModuleId) {
    const list = getters.getList;
    list.forEach((element) => {
      if (element?.type === "course") {
        if (element.items !== ([] || undefined)) {
          element.items = element.items.map((item) => {
            if (item.id === courseModuleId) {
              if ("discountedPrice" in item) {
                delete item.discountedPrice;
                return item;
              } else {
                return { ...item, discountedPrice: 0 };
              }
            }
            return item;
          });
          dispatch("addItem", element);
        }
      }
    });
  },
  findBindedProduct({ getters }, courseModules) {
    const list = getters.getList;
    list.forEach((element) => {
      if (
        element.type === "physical_product" &&
        element?.course_module_id !== null
      ) {
        courseModules.forEach((module) => {
          if (element.course_module_id === module.id) {
            return { ...module, discountedPrice: 0 };
          }
        });
      }
    });
  },
  addItem({ commit, dispatch }, payload) {
    dispatch("ui/setCartActive", true, { root: true });
    const alreadyInCart = state.list.find(
      (item) => item.id === payload.id && item.type === payload.type
    );
    if (alreadyInCart && !payload.items) return;
    if (state.isCouponComponentVisible)
      commit("setCouponStatus", "emptyCoupon");
    if (
      payload?.type === "physical_product" &&
      payload?.course_module_id !== null
    ) {
      dispatch("foundBindedModule", payload.course_module_id);
    }
    if (payload?.type === "course" && payload.items !== []) {
      dispatch("findBindedProduct", payload.items);
    }
    const parsedPayload = {
      type: payload.type,
      id: payload.id,
      course_module_id: payload.course_module_id,
      name: payload.name,
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
  removeItem({ commit, dispatch }, payload) {
    if (
      payload?.type === "physical_product" &&
      payload?.course_module_id !== null
    ) {
      dispatch("foundBindedModule", payload.courseModuleId);
    }
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
