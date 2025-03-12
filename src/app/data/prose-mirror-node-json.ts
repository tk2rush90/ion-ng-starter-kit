export interface ProseMirrorNodeJson {
  type: string;
  content?: ProseMirrorNodeJson[];
  attrs?: Record<string, any>;
}
