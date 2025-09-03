interface Session {
    id: string;
    secretHash: Uint8Array;
    lastVerifiedAt: Date;
    createdAt: Date;
}
