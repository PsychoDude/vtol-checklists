<!-- src/components/ResponsiveImage.svelte -->
<script lang="ts">
    export let src: string;
    export let alt: string = '';
</script>

<img {src} {alt} style="max-width: 100%; height: auto;">