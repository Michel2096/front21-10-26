import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

import { store } from "@/store/store";
import { restoreSession } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function RootStack() {
    const dispatch = useAppDispatch();
    const sessionChecked = useAppSelector(
        (state) => state.auth.sessionChecked
    );

    // al abrir la app se revisa si quedo un token guardado
    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);

    if (!sessionChecked) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack>

            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="home"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="profile"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="students"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="settings"
                options={{ headerShown: false }}
            />

        </Stack>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <RootStack />
        </Provider>
    );
}
