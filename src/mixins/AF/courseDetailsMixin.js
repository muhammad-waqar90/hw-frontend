export default {
  methods: {
    isEntitySelected(selectedEntityData, item, entity) {
      return (
        selectedEntityData?.list?.some(
          (selectedItem) => selectedItem.id === item.id
        ) && selectedEntityData?.entity === entity
      );
    },

    areAllEntitiesSelected(selectedEntityData, entityData, entity) {
      return (
        selectedEntityData?.list?.length === entityData.length &&
        selectedEntityData?.entity === entity
      );
    },

    onChangeEntitySelection(selectedEntityData, selected, item, entity) {
      let list = selectedEntityData?.list || [];
      list = selected
        ? list.filter((selectedItem) => selectedItem.id !== item.id)
        : [...list, item];

      return {
        entity: (list.length && entity) || "",
        list: list,
        parent:
          entity === "module" ? item.course_level_id : item.course_module_id,
      };
    },
  },
};
