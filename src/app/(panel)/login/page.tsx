
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [alias, setAlias] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoURL, setPhotoURL] = useState(""); // For now, a URL input

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const canSubmitSignUp = agreeToTerms && agreeToPrivacy && fullName && alias && country && email && password;

  const handleUserCreation = async (user: any, isGoogleSignIn: boolean = false) => {
    const userDocRef = doc(db, "users", user.uid);
    let userRoles = ['subscriber', 'sharer'];
    if (user.email && user.email.includes('admin')) {
      userRoles = ['admin'];
    }

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: isGoogleSignIn ? user.displayName : alias, // Use alias for email/pass signup
      fullName: isGoogleSignIn ? user.displayName : fullName, // Use displayName from Google or fullName from form
      alias: isGoogleSignIn ? (user.displayName || user.email?.split('@')[0] || "user") : alias,
      country: isGoogleSignIn ? "" : country, // Country might not be available from Google easily
      phoneNumber: isGoogleSignIn ? (user.phoneNumber || "") : phoneNumber,
      photoURL: user.photoURL || photoURL, // Use Google's photoURL if available or from form
      roles: userRoles,
      createdAt: serverTimestamp(),
      publicKey: "placeholder_public_key", // Placeholder for E2EE public key
    };
    await setDoc(userDocRef, userData);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!isLogin && !canSubmitSignUp) {
      toast({
        title: "Campos Requeridos Incompletos",
        description: "Por favor, completa todos los campos obligatorios y acepta los términos y la política de privacidad.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Inicio de Sesión Exitoso", description: "¡Bienvenido de nuevo!" });
        router.push("/");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        if (newUser) {
          await handleUserCreation(newUser);
        }
        toast({ title: "Registro Exitoso", description: "Tu cuenta ha sido creada. Por favor, inicia sesión." });
        setIsLogin(true);
        setAgreeToTerms(false);
        setAgreeToPrivacy(false);
        // Clear additional fields
        setFullName("");
        setAlias("");
        setCountry("");
        setPhoneNumber("");
        setPhotoURL("");
      }
    } catch (error: any) {
      console.error("Error de autenticación:", error.code, error.message);
      let toastTitle = isLogin ? "Fallo de Inicio de Sesión" : "Fallo de Registro";
      let toastDescription = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";

      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
            toastDescription = isLogin ?
              "Correo o contraseña incorrectos. Si no tienes una cuenta, por favor haz clic en 'Regístrate' abajo." :
              "No se pudo procesar tu solicitud. Por favor, verifica los detalles e inténtalo de nuevo.";
            break;
          case 'auth/user-not-found':
            toastDescription = "Correo o contraseña incorrectos. Si no tienes una cuenta, por favor haz clic en 'Regístrate' abajo.";
            break;
          case 'auth/wrong-password':
            toastDescription = "Correo o contraseña incorrectos. Si no tienes una cuenta, por favor haz clic en 'Regístrate' abajo.";
            break;
          case 'auth/email-already-in-use':
            toastDescription = "Esta dirección de correo ya está registrada. Por favor, intenta iniciar sesión.";
            break;
          case 'auth/weak-password':
            toastDescription = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
            break;
          case 'auth/invalid-email':
            toastDescription = "La dirección de correo no es válida. Por favor, verifica e inténtalo de nuevo.";
            break;
          default:
            toastDescription = error.message || toastDescription;
        }
      } else {
        toastDescription = error.message || toastDescription;
      }

      toast({
        title: toastTitle,
        description: toastDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          await handleUserCreation(user, true); // Pass true for Google sign-in
          toast({ title: "Registro Exitoso", description: "¡Bienvenido! Tu cuenta ha sido creada." });
        } else {
          // Existing user
          toast({ title: "Inicio de Sesión Exitoso", description: "¡Bienvenido de nuevo!" });
        }
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error de inicio de sesión con Google:", error.code, error.message);
      toast({
        title: "Fallo de Inicio de Sesión con Google",
        description: error.message || "No se pudo iniciar sesión con Google.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto mb-4">
            <Icons.Logo className="h-16 w-16 text-primary" />
          </Link>
          <CardTitle className="text-3xl font-bold">{isLogin ? "Bienvenido de Nuevo" : "Crear Cuenta en SuscripGrupo"}</CardTitle>
          <CardDescription>{isLogin ? "Inicia sesión para acceder a tu panel." : "Regístrate para empezar a compartir y ahorrar."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="fullName">Nombre Completo *</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Pérez" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="alias">Alias / Nombre de Usuario *</Label>
                  <Input id="alias" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="juanperez88" required />
                  <p className="text-xs text-muted-foreground">Este será tu nombre público en la plataforma.</p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">País de Residencia *</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country" required>
                      <SelectValue placeholder="Selecciona tu país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CO">Colombia</SelectItem>
                      <SelectItem value="US">Estados Unidos</SelectItem>
                      <SelectItem value="ES">España</SelectItem>
                      <SelectItem value="MX">México</SelectItem>
                      <SelectItem value="AR">Argentina</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Número de Teléfono</Label>
                  <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+57 3001234567" />
                  <p className="text-xs text-muted-foreground">Opcional. Para verificación y seguridad.</p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="photoURL">URL de Foto de Perfil</Label>
                  <Input id="photoURL" type="url" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} placeholder="https://ejemplo.com/foto.png" />
                   <p className="text-xs text-muted-foreground">Opcional. Pega la URL de una imagen.</p>
                </div>
              </>
            )}
            <div className="space-y-1">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••• (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
              />
            </div>

            {!isLogin && (
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(Boolean(checked))}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto los{" "}
                      <Link href="/terms-of-service" target="_blank" className="underline text-primary hover:text-primary/80">
                        Términos de Servicio
                      </Link> *
                    </label>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={agreeToPrivacy}
                    onCheckedChange={(checked) => setAgreeToPrivacy(Boolean(checked))}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto la{" "}
                      <Link href="/privacy-policy" target="_blank" className="underline text-primary hover:text-primary/80">
                        Política de Privacidad
                      </Link> *
                    </label>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full text-base py-3"
              disabled={loading || (!isLogin && !canSubmitSignUp)}
            >
              {loading && <Icons.Logo className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Iniciar Sesión" : "Regístrate"}
            </Button>
          </form>
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continuar con
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6 text-base py-3" onClick={handleGoogleSignIn} disabled={loading}>
            {loading && <Icons.Logo className="mr-2 h-4 w-4 animate-spin" />}
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.7 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia Sesión"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
