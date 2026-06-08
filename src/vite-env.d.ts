/// <reference types="vite/client" />

declare module "*.css?inline" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "98.css?inline" {
  const content: string;
  export default content;
}

declare module "98.css" {
  const content: string;
  export default content;
}
