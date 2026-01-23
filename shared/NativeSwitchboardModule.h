#pragma once

#include <AppSpecsJSI.h>

#include <memory>
#include <string>

namespace facebook::react {

class NativeSwitchboardModule : public NativeSwitchboardModuleCxxSpec<NativeSwitchboardModule> {
public:
  NativeSwitchboardModule(std::shared_ptr<CallInvoker> jsInvoker);

  std::string processCommand(jsi::Runtime& rt, std::string command);
};

} // namespace facebook::react
