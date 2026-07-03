<script lang="ts">
  export let src: string;
  export let alt: string;
  export let caption: string;
  export let label = "";
</script>

<figure
  class="not-prose my-10 overflow-hidden rounded-xl border border-border bg-muted/35 p-2 shadow-sm dark:bg-muted/40"
>
  {#if label}
    <div class="flex items-center justify-between px-2 pb-2 pt-1">
      <span class="text-xs font-medium uppercase text-muted-foreground">{label}</span>
    </div>
  {/if}
  <img
    {src}
    {alt}
    loading="lazy"
    decoding="async"
    class="aspect-auto w-full rounded-lg border border-border/70 object-cover"
  />
  <figcaption class="px-2 pb-1 pt-3 text-sm leading-6 text-muted-foreground">
    {caption}
  </figcaption>
</figure>
