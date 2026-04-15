import { z } from "zod";

export const RuntimeType = z.enum(["npm", "python", "docker", "binary"]);

export const UpstreamRegistry = z.enum(["npm", "pypi", "ghcr", "dockerhub", "custom"]);

export const PermissionSchema = z.object({
  network: z.array(z.string()).default([]),
  filesystem: z.array(z.string()).default([]),
  env: z.array(z.string()).default([]),
  secrets: z.array(z.string()).default([]),
});

export const ManifestSchema = z.object({
  name: z.string().regex(/^@[a-z0-9-]+\/[a-z0-9-]+$/, "Name must follow @scope/name format"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be valid semver"),
  description: z.string().min(10).max(500),
  license: z.string(),
  author: z.string(),
  homepage: z.string().url().optional(),
  repository: z.string().url().optional(),
  runtime: z.object({
    type: RuntimeType,
    version: z.string().optional(),
    entrypoint: z.string().optional(),
    package: z.object({
      registry: UpstreamRegistry,
      name: z.string(),
      version: z.string(),
    }),
  }),
  transports: z.array(z.enum(["stdio", "sse", "streamable_http"])).min(1),
  permissions: PermissionSchema,
  config_schema: z.string().optional(),
  client_examples: z.record(z.string()).optional(),
  tags: z.array(z.string()).default([]),
  mcp_min_version: z.string().default("1.0.0"),
});

export type Manifest = z.infer<typeof ManifestSchema>;
