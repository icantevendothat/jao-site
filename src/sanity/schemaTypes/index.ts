import { type SchemaTypeDefinition } from 'sanity'
import project from './projects' // Ensure the path matches your file name

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project],
}