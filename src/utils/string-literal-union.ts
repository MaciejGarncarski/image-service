import { TLiteral, Type, type Union } from "@sinclair/typebox";

type IntoStringLiteralUnion<T> = { [K in keyof T]: T[K] extends string ? TLiteral<T[K]> : never };

export function StringLiteralUnion<T extends string[]>(
	values: [...T],
): Union<IntoStringLiteralUnion<T>> {
	const literals = values.map((value) => Type.Literal(value));
	return Type.Union(literals as unknown as [...IntoStringLiteralUnion<T>]);
}
