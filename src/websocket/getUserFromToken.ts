import jwt from 'jsonwebtoken';

type JWTPayload = {
  sub: string;
};

//Função para conseguir userID pelo header:Authorization->JWT token

export function getUserIDFromRequest(
  authHeader: string | undefined
): string | null {
  if (!authHeader || !process.env.JWT_SECRET) return null;

  try {
    const payload = jwt.verify(
      authHeader,
      process.env.JWT_SECRET
    ) as JWTPayload;
    return payload.sub;
  } catch (err: any) {
    return null;
  }
}
