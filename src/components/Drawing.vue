<template>
  <div id="drawing-container">
    <vue-draggable-resizable
      :x="100"
      :y="100"
      :width="100"
      :height="40"
      @dragstop="onDrawingDragStop"
      @resizestop="onDrawingResizeStop"
      :parent="true"
      id="drawing"
      :class="{ editable: drawingEditable }"
      :draggable="!disableEditing"
      :resizable="!disableEditing"
      :style="{'font-size': `${fontSize}px`, color: color}"
    >
      {{ drawingText }}
    </vue-draggable-resizable>
    <!-- <div
      id="drawing"
      :style="{transform: `translate(${drawingX}px, ${drawingY}px)`, 'font-size': `${fontSize}px`, color: color}"
      @mousedown.prevent="onDrawingMouseDown"
      @touchstart.prevent="onDrawingTouchStart"
    >{{ drawingText }}</div> -->
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable';
import { mapState } from 'vuex';

export default {
  name: 'Drawing',

  components: {
    VueDraggableResizable,
  },

  props: {
    disableEditing: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
    };
  },

  methods: {
    onDrawingDragStop(left, top) {
      this.$store.commit('drawing/UPDATE_X', left);
      this.$store.commit('drawing/UPDATE_Y', top);
    },

    onDrawingResizeStop(left, top, width, height) {
      this.$store.commit('drawing/UPDATE_X', left);
      this.$store.commit('drawing/UPDATE_Y', top);
      this.$store.commit('drawing/UPDATE_WIDTH', width);
      this.$store.commit('drawing/UPDATE_HEIGHT', height);
    },
  },

  computed: {
    ...mapState({
      drawingX: state => state.drawing.x,
      drawingY: state => state.drawing.y,
      drawingText: state => state.drawing.text,
      fontSize: state => state.drawing.fontSize,
      color: state => state.drawing.color,
    }),

    drawingEditable() {
      console.log(this.drawingText);
      return !this.disableEditing && (this.drawingText !== '');
    },
  },
};
</script>

<style lang="scss" scoped>
#drawing-container {
  width: 100%;
  height: 100%;
  position: absolute;

  #drawing {
    background: transparent;
    position: absolute;
    font-size: 40px;
    font-family: Anton, Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    top: 45%;
    left: 45%;
    // overflow: hidden;

    text-align: center;

    user-select: none;
  }
}
</style>

<style lang="scss">
#drawing.editable {
  .handle {
    display: block !important;
  }
}
.handle-tl {
  top: 0 !important;
  left: 0 !important;
}
.handle-tm {
  top: 0 !important;
}
.handle-tr {
  top: 0 !important;
  right: 0 !important;
}
.handle-mr {
  right: 0 !important;
}
.handle-br {
  bottom: 0 !important;
  right: 0 !important;
}
.handle-bm {
  bottom: 0 !important;
}
.handle-bl {
  bottom: 0 !important;
  left: 0 !important;
}
.handle-ml {
  left: 0 !important;
}
</style>