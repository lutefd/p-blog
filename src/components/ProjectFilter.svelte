<script lang="ts">
  import { Code2, ExternalLink } from "@lucide/svelte";

  type Project = {
    slug: string;
    title: string;
    description: string;
    repo?: string;
    url?: string;
    stack: string[];
    featured: boolean;
    status: "active" | "stable" | "archived" | "draft";
  };

  let { projects }: { projects: Project[] } = $props();

  let selectedStack = $state("all");
  let selectedStatus = $state("all");

  const stacks = $derived(
    Array.from(new Set(projects.flatMap((project) => project.stack))).sort(),
  );
  const statuses = $derived(
    Array.from(new Set(projects.map((project) => project.status))).sort(),
  );
  const filtered = $derived(
    projects.filter((project) => {
      const stackMatch = selectedStack === "all" || project.stack.includes(selectedStack);
      const statusMatch = selectedStatus === "all" || project.status === selectedStatus;
      return stackMatch && statusMatch;
    }),
  );
</script>

<section class="space-y-5">
  <div class="flex flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-wrap gap-2">
      <button
        class:selected={selectedStack === "all"}
        class="filter-button"
        type="button"
        onclick={() => (selectedStack = "all")}
      >
        all
      </button>
      {#each stacks as stack}
        <button
          class:selected={selectedStack === stack}
          class="filter-button"
          type="button"
          onclick={() => (selectedStack = stack)}
        >
          {stack}
        </button>
      {/each}
    </div>
    <label class="flex items-center gap-2 text-sm text-muted-foreground">
      status
      <select
        class="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
        bind:value={selectedStatus}
      >
        <option value="all">all</option>
        {#each statuses as status}
          <option value={status}>{status}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="grid gap-3">
    {#each filtered as project}
      <article class="rounded-md border border-border p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-base font-semibold">{project.title}</h2>
              <span class="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {project.status}
              </span>
            </div>
            <p class="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
              {project.description}
            </p>
          </div>
          <div class="flex shrink-0 gap-2">
            {#if project.repo}
              <a class="icon-button" href={project.repo} aria-label={`${project.title} repository`}>
                <Code2 size={16} />
              </a>
            {/if}
            {#if project.url}
              <a class="icon-button" href={project.url} aria-label={`${project.title} website`}>
                <ExternalLink size={16} />
              </a>
            {/if}
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          {#each project.stack as stack}
            <span class="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{stack}</span>
          {/each}
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  .filter-button {
    border: 1px solid hsl(var(--border));
    border-radius: 0.375rem;
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
    height: 2.25rem;
    padding: 0 0.75rem;
  }

  .filter-button:hover,
  .filter-button.selected {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  .icon-button {
    align-items: center;
    border: 1px solid hsl(var(--border));
    border-radius: 0.375rem;
    color: hsl(var(--muted-foreground));
    display: inline-flex;
    height: 2.25rem;
    justify-content: center;
    width: 2.25rem;
  }

  .icon-button:hover {
    background: hsl(var(--muted));
    color: hsl(var(--foreground));
  }
</style>
