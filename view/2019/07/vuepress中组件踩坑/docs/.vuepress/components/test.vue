<template>
    <div>
        <button type="button" @click="add">加价</button>
        <br />
        <span>{{ this.count }}</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0
        };
    },
    methods: {
        add: function() {
            this.count++;
        }
    }
};
</script>