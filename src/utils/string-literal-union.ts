import { SchemaOptions, Type } from "@sinclair/typebox";

export function StringLiteralUnion<T extends string[]>(values: [...T], config?: SchemaOptions) {
	const literals = values.map((value) => Type.Literal(value));
	return Type.Union(literals, config);
}
