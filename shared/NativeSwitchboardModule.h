#pragma once

#include <AppSpecsJSI.h>

#include <memory>
#include <string>

#include <switchboard/SwitchboardJSONRPC.hpp>

namespace facebook::react {

class NativeSwitchboardModule : public NativeSwitchboardModuleCxxSpec<NativeSwitchboardModule> {
public:
  NativeSwitchboardModule(std::shared_ptr<CallInvoker> jsInvoker);

  std::string processCommand(jsi::Runtime& rt, std::string command);

private:
  switchboard::SwitchboardJSONRPC switchboard;
};

} // namespace facebook::react
