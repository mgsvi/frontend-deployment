import nextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions = {
  
  providers: [
    KeycloakProvider({
        clientId: process.env.KEYCLOAK_ID,
        clientSecret: process.env.KEYCLOAK_SECRET,
        issuer: process.env.KEYCLOAK_ISSUER,

      })
  ],

  callbacks:{
    async jwt({token, account}){
        if(account){
            token.accessToken = account.access_token
        }
        return token
    },
    async session({session, token}){
        session.whatever ="abc"
        return session
    }
  }
  
}

const handler = nextAuth(authOptions)
export {handler as GET, handler as POST};