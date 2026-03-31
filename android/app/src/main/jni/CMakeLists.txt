cmake_minimum_required(VERSION 3.13)

project(appmodules)

# Creates the shared library, wires up codegen, autolinking, and prefab
# packages from react-native. A custom OnLoad.cpp in this directory is
# automatically picked up instead of the default one.
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# Prefab packages exposed by the Switchboard AARs in android/app/libs/
find_package(SwitchboardSDK REQUIRED CONFIG)
find_package(SwitchboardOpenAI REQUIRED CONFIG)

# Shared C++ sources (used by both iOS and Android)
set(SHARED_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../shared")

target_sources(${CMAKE_PROJECT_NAME} PRIVATE
    ${SHARED_DIR}/NativeSwitchboardModule.cpp
)

target_include_directories(${CMAKE_PROJECT_NAME} PRIVATE
    ${SHARED_DIR}
)

target_link_libraries(${CMAKE_PROJECT_NAME}
    SwitchboardSDK::SwitchboardSDK
    SwitchboardOpenAI::SwitchboardOpenAI
)
